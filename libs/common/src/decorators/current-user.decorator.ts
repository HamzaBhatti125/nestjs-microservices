import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../models/user.entity';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);

function getCurrentUserByContext(context: ExecutionContext): User {
  const request = context.switchToHttp().getRequest();
  return request.user;
}
