import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @Transform(params => params.value.trim())
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string;

  @Transform(({ value, obj }) => {
    if (obj.password.includes(value.trim())) {
      throw new BadRequestException('password는 name과 같은 문자열을 포함할 수 없습니다.');
    }
    return value.trim();
  })
  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}

export class UserLoginDto {
    email: string;
    password: string;
  }

  export class VerifyEmailDto {
    signupVerifyToken: string;
  }

  export interface UserInfo {
    id: string;
    name: string;
    email: string;
  }