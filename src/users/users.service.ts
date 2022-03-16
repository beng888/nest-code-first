import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/global/prisma.service';
import { UserCreateInput, UserWhereUniqueInput } from 'src/@generated/prisma-nestjs-graphql/user';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  create(createUserInput: UserCreateInput) {
    return this.prisma.user
      .create({
        data: createUserInput,
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          console.log('%c⧭', 'color: #731d6d', error);
          if (error.code === 'P2002') {
            throw new HttpException(`User with that email already exists`, HttpStatus.BAD_REQUEST);
          }
        }
        throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  async findOne(userWhereUniqueInput: UserWhereUniqueInput) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: userWhereUniqueInput.email,
      },
    });

    if (!user) throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);

    return user;
  }

  async update(userWhereUniqueInput: UserWhereUniqueInput, data: Prisma.UserUpdateInput) {
    console.log('%c⧭', 'color: #997326', data);
    console.log('%c⧭', 'color: #e57373', userWhereUniqueInput);
    const user = await this.prisma.user.update({
      where: { email: userWhereUniqueInput.email },
      data,
    });

    if (!user) throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    return user;
  }
}
