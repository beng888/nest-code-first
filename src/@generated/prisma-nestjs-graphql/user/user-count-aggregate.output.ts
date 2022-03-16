import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { HideField } from '@nestjs/graphql';

@ObjectType()
export class UserCountAggregate {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Int, {nullable:false})
    email!: number;

    @HideField()
    password!: number;

    @HideField()
    createdAt!: number;

    @HideField()
    updatedAt!: number;

    @HideField()
    refresh_token!: number;

    @HideField()
    isEmailConfirmed!: number;

    @Field(() => Int, {nullable:false})
    _all!: number;
}