import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/@generated/prisma-nestjs-graphql/user';

@ObjectType()
export class AuthResponse extends User {
  @Field()
  access_token?: string;
}
