import { createParamDecorator, ExecutionContext, HttpException } from '@nestjs/common';
import { JwtPayload } from 'apps/api-gateway/src/app/auth/jwt.strategy';

export const User = createParamDecorator((data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as JwtPayload;

  if (!user) {
    throw new HttpException('Unauthorized', 401);
  }

  return data ? user[data] : user;
});
