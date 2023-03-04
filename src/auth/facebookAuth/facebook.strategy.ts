import { Strategy } from 'passport-facebook';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      // scope: ['email', 'public_profile'],
      // scope: ['user_friends', 'manage_pages'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any) {
    return { profile };
  }
}
