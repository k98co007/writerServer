import * as uuid from 'uuid';
import { ulid } from 'ulid';
import * as jwt from 'jsonwebtoken';
import { Inject, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '@nestjs/cqrs';
import { IEvent } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserCommand, LoginCommand, VerifyAccessTokenCommand } from './user.command';
import { User, UserDocument } from './user.schema';
import { UserRepository } from './user.repository';
import { UserInfo } from './user.dto';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private userRepository: UserRepository,
  ) { }

  async execute(command: CreateUserCommand) {
    const { name, email, password } = command;

    const user = await this.userRepository.findByEmail(email);
    if (user !== null) {
      throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
    }

    const id = ulid();
    const signupVerifyToken = uuid.v1();

    await this.userRepository.create({
      id: id,
      name: name,
      email: email,
      password: password,
      signupVerifyToken: signupVerifyToken,
    });
  }
}

@Injectable()
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) { }

  async execute(command: LoginCommand) {
    const { email, password } = command;

    const user = await this.userRepository.findByEmail(email);
    if (user === null) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

}

@Injectable()
@CommandHandler(VerifyAccessTokenCommand)
export class VerifyAccessTokenHandler implements ICommandHandler<VerifyAccessTokenCommand> {

  async execute(command: VerifyAccessTokenCommand) {
    const { jwtString } = command;

    try {
      const payload = jwt.verify(jwtString, 'testsecret') as (jwt.JwtPayload | string) & User;

      const { id, email } = payload;

      return {
        userId: id,
        email,
      }

    } catch (e) {
      throw new UnauthorizedException()
    }
  }

}

export class GetUserInfoQuery implements IQuery {
  constructor(
    readonly userId: string,
  ) { }
}

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoQueryHandler implements IQueryHandler<GetUserInfoQuery> {
  constructor(
    private userRepository: UserRepository,
  ) { }

  async execute(query: GetUserInfoQuery): Promise<UserInfo> {
    const { userId } = query;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

export abstract class CqrsEvent {
  constructor(readonly name: string) { }
}

export class UserCreatedEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly email: string,
    readonly signupVerifyToken: string,
  ) {
    super(UserCreatedEvent.name);
  }
}