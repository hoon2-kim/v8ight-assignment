import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const req: Request = context.switchToHttp().getRequest();

    const user = req.user;

    return !data ? user : user[data];
  },
);
