import * as jwt from 'jsonwebtoken';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {

  login(user: User) {
    const payload = { ...user };

    return jwt.sign(payload, 'testsecret', {
      expiresIn: '1d',
      audience: 'example.com',
      issuer: 'example.com',
    });
  }

  verify(jwtString: string) {
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
