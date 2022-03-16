import { Request, Response } from 'express';
import { User } from 'src/@generated/prisma-nestjs-graphql/user';

type Ctx = {
  req?: Request & { user: User };
  res?: Response;
  user: User;
};

export default Ctx;
