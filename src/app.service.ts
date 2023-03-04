import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EmailAndPasswordSignUpDto } from './dtos/EmailAndPassword.dto';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  // SignUp with email and password
  async WithEmailAndPasswordSignUp(signupInfo: EmailAndPasswordSignUpDto) {
    try {
      const { name, username, password } = signupInfo;

      const isExistUser = await this.prisma.users.findUnique({
        where: { username } as Prisma.usersWhereUniqueInput,
      });

      if (isExistUser)
        throw new HttpException(
          'User already exist, do login please',
          HttpStatus.BAD_REQUEST,
        );
      const hash = await bcrypt.hash(password, 10);
      const user = await this.prisma.users.create({
        data: { name, username, password: hash, provider: 'emailandpassword' },
      });
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  // Sign in/up with google
  async WithGoogle(user) {
    try {
      const isExisUser = await this.prisma.users.findUnique({
        where: { username: user.profile.emails[0].value },
      });

      if (isExisUser) {
        return isExisUser;
      } else {
        const newUser = await this.prisma.users.create({
          data: {
            name: user.profile.displayName,
            username: user.profile.emails[0].value,
            provider: 'google',
            data: { jsonData: user },
            googleId: user.profile.id,
          },
        });
        return newUser;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Sign in/up with facebook
  async WithFacebook(user) {
    try {
      const isExisUser = await this.prisma.users.findUnique({
        where: { facebookId: user.profile.id } as Prisma.usersWhereUniqueInput,
      });

      if (isExisUser) {
        return isExisUser;
      } else {
        const newUser = await this.prisma.users.create({
          data: {
            name: user.profile.displayName,
            provider: user.profile.provider,
            data: { jsonData: user },
            facebookId: user.profile.id,
          },
        });
        return newUser;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
