import { Injectable } from '@nestjs/common';
import { UserDocument } from '../../../libs/common/src/models/user.schema';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDocument, response: Response) {
    const tokenPayload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();
    const expiresIn = +this.configService.get<string>('JWT_EXPIRES_IN');
    expires.setSeconds(expires.getSeconds() + expiresIn);

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
      sameSite: 'lax',
      secure: false, // Set to true in production with HTTPS
    });
  }
}
