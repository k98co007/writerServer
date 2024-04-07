import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { UserService } from './user.service';

import { AuthModule } from 'src/auth/auth.module';
import { CreateUserHandler } from './user.handler';
import { LoginHandler } from './user.handler';
import { VerifyAccessTokenHandler } from './user.handler';
import { GetUserInfoQueryHandler } from './user.handler';

import { User, UserSchema } from './user.schema';
import { UserRepository } from './user.repository';

const commandHandlers = [
  CreateUserHandler,
  LoginHandler,
  VerifyAccessTokenHandler,
];

const queryHandlers = [
  GetUserInfoQueryHandler,
];

@Module({
  imports: [
    AuthModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService,
    UserRepository,
    ...commandHandlers,
    ...queryHandlers,
  ],
  exports :[UserService],
})
export class UserModule {}
