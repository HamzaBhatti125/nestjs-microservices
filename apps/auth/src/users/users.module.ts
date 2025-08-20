import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { DatabaseModule } from '@app/common';
import {
  UserDocument,
  UserSchema,
} from '../../../../libs/common/src/models/user.schema';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
