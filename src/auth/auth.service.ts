import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.users.findUnique({
      where: { username } as Prisma.usersWhereUniqueInput,
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);

    user.password = undefined;
    return user;
  }

  async login(user: any) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }
}
