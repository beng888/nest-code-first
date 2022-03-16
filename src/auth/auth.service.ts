import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserCreateInput } from 'src/@generated/prisma-nestjs-graphql/user';
import { CookieOptions } from 'express';
import Ctx from 'src/common/types';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: 'auth/refresh',
};

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService, private config: ConfigService) {}

  async register(userCreateInput: UserCreateInput, context: Ctx) {
    const password = await argon.hash(userCreateInput.password);
    const user = await this.usersService.create({ ...userCreateInput, password });
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken({ ...user, ...tokens }, context);
    return { ...user, ...tokens };
  }

  async login(context: Ctx) {
    const { user } = context;
    await this.updateRefreshToken({ ...user }, context);
    return user;
  }

  async logout(context: Ctx) {
    const user = context.req.user;
    const updatedUser = await this.usersService.update(user, { refresh_token: null });
    if (updatedUser.refresh_token) throw new ForbiddenException('Log Out Failed');
    context.res.cookie('token', '', { ...cookieOptions, maxAge: 1000 });
    return { message: 'Successfully Logged Out!' };
  }

  /* ---------------------------------- UTILS --------------------------------- */

  async getTokens(user: User): Promise<{ access_token: string; refresh_token: string }> {
    const jwtPayload = { sub: user.id, email: user.email };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: `${this.config.get<string>('REFRESH_TOKEN_EXPIRATION')}s`,
      }),
    ]);

    return { access_token, refresh_token };
  }

  async validateUser(userInput: UserCreateInput, isRefresh?: boolean) {
    const user = await this.usersService.findOne(userInput);
    const tokens = await this.getTokens(user);
    const valid = isRefresh
      ? await argon.verify(user.refresh_token, userInput.refresh_token)
      : await argon.verify(user.password, userInput.password);

    if (valid) return { ...user, ...tokens };
    throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
  }

  async updateRefreshToken(user: User, context: Ctx) {
    const hash = await argon.hash(user.refresh_token);
    this.usersService.update(user, { refresh_token: hash });

    context.res.cookie('token', user.refresh_token, {
      maxAge: this.config.get<number>('REFRESH_TOKEN_EXPIRATION'),
      ...cookieOptions,
    });
  }
}
