import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserCreateInput } from 'src/@generated/prisma-nestjs-graphql/user';
import { MessageResponse } from 'src/common/dto';
import { JwtAccessGuard, JwtRefreshGuard, LocalAuthGuard } from 'src/common/guards';
import { AuthResponse } from './dto';
import Ctx from 'src/common/types';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  register(@Args('userCreateInput') userCreateInput: UserCreateInput, @Context() context: Ctx) {
    return this.authService.register(userCreateInput, context);
  }

  @Mutation(() => AuthResponse)
  @UseGuards(LocalAuthGuard)
  login(@Args('userLoginInput') userLoginInput: UserCreateInput, @Context() context: Ctx) {
    return this.authService.login(context);
  }

  @Mutation(() => MessageResponse)
  @UseGuards(JwtAccessGuard)
  logout(@Context() context: Ctx) {
    return this.authService.logout(context);
  }

  @Mutation(() => AuthResponse)
  @UseGuards(JwtRefreshGuard)
  refresh(@Context() context: Ctx) {
    return this.authService.login(context.req);
  }
}
