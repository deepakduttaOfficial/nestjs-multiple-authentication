import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { FacebookAuthGuard } from './auth/facebookAuth/facebook-auth.guard';
import { GhitbAuthGuard } from './auth/githubAuth/github-auth.guard';
import { GoogleAuthGuard } from './auth/googleAuth/google-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

import { EmailAndPasswordSignUpDto } from './dtos/EmailAndPassword.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  // Protected route
  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@Request() req): string {
    return req.user;
  }

  // Email and password
  // Sign up------------------------>
  @Post('signup/username')
  WithEmailAndPasswordSignUp(@Body() signupInfo: EmailAndPasswordSignUpDto) {
    return this.appService.WithEmailAndPasswordSignUp(signupInfo);
  }
  // Sign in-------------------------->
  @Post('signin/username')
  @UseGuards(LocalAuthGuard)
  WithEmailAndPasswordSignIn(@Request() req) {
    return this.authService.login(req.user);
  }

  // Sign In/Up with GOOGLE-------------------------->
  @UseGuards(GoogleAuthGuard)
  @Get('google/auth')
  SignInWithGoogle() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async SignInWithGoogleCallback(@Request() req) {
    const { user } = req;
    const userData = await this.appService.WithGoogle(user);
    const { data, ...rest } = userData;
    const { access_token } = await this.authService.login(rest);
    return { access_token, ...rest, data };
  }

  // Sign In/Up with Facebook-------------------------->
  @UseGuards(FacebookAuthGuard)
  @Get('facebook/auth')
  SignInWithFacebook() {}

  @UseGuards(FacebookAuthGuard)
  @Get('facebook/callback')
  async SignInWithFacebookCallback(@Request() req) {
    const { user } = req;
    const userData = await this.appService.WithFacebook(user);
    console.log(userData);

    const { data, ...rest } = userData;
    const { access_token } = await this.authService.login(rest);
    return { access_token, ...rest, data };
  }

  // Sign In/Up with Github-------------------------->
  @UseGuards(GhitbAuthGuard)
  @Get('github/auth')
  SignInWithGithub() {}

  @UseGuards(GhitbAuthGuard)
  @Get('github/callback')
  async SignInWithGithubCallback(@Request() req) {
    const { user } = req;
    const userData = await this.appService.WithGithub(user);
    const { data, ...rest } = userData;
    const { access_token } = await this.authService.login(rest);
    return { access_token, ...rest, data };
  }
}
