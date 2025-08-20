import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../models/user.schema';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);

function getCurrentUserByContext(context: ExecutionContext): UserDocument {
  if (context.getType() === 'http') {
    const request = context.switchToHttp().getRequest();
    return request.user;
  }
  const user = context.getArgs()[2]?.req.headers?.user;
  if (user) {
    return JSON.parse(user);
  }
}
