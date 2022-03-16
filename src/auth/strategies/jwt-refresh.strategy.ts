import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService, private authService: AuthService) {
    super({
      secretOrKey: config.get<string>('REFRESH_TOKEN_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.token;
        },
      ]),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refresh_token = req.cookies.token;
    return await this.authService.validateUser({ ...payload, refresh_token }, true);
  }
}
