import { registerEnumType } from '@nestjs/graphql';

export enum UserScalarFieldEnum {
    id = "id",
    email = "email",
    password = "password",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    refresh_token = "refresh_token",
    isEmailConfirmed = "isEmailConfirmed"
}


registerEnumType(UserScalarFieldEnum, { name: 'UserScalarFieldEnum', description: undefined })
