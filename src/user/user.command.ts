import { ICommand } from '@nestjs/cqrs';

export class CreateUserCommand implements ICommand {
    constructor(
      readonly name: string,
      readonly email: string,
      readonly password: string,
    ) { }
}

export class LoginCommand implements ICommand {
  constructor(
    readonly email: string,
    readonly password: string,
  ) { }
}

export class VerifyAccessTokenCommand implements ICommand {
    constructor(
      readonly jwtString: string,
    ) { }
}

