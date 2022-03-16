import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy, JwtRefreshStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [PassportModule.register({}), JwtModule.register({}), UsersModule],
  providers: [AuthService, AuthResolver, LocalStrategy, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
