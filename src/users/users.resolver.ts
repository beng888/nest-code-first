import { Resolver, Query, Args } from '@nestjs/graphql';
import { User, UserWhereUniqueInput } from 'src/@generated/prisma-nestjs-graphql/user';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('UserWhereUniqueInput')
    userWhereUniqueInput: UserWhereUniqueInput,
  ) {
    return this.userService.findOne(userWhereUniqueInput);
  }

  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: UserCreateInput) {
  //   return this.userService.create(createUserInput);
  // }

  // @Query(() => [User], { name: 'user' })
  // findAll() {
  //   return this.userService.findAll();
  // }
}
