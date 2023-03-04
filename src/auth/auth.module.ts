import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport/dist';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from './auth.service';
import { FacebookStrategy } from './facebookAuth/facebook.strategy';
import { GithubStrategy } from './githubAuth/github.strategy';
import { GoogleStrategy } from './googleAuth/google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'jwtConstants.secret',
      signOptions: { expiresIn: '300s' },
    }),
  ],
  providers: [
    AuthService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    GithubStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
