import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignInDto } from './dto/sign-in.dto';
import { plainToInstance } from 'class-transformer';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller()
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Post('auth/sign-in')
  async signIn(@Body() data) {
    const signInDto = plainToInstance(SignInDto, data);
    return this.authClient.send('sign-in', signInDto);
  }

  @Post('auth/sign-up')
  async signUp(@Body() data) {
    const signUpDto = plainToInstance(SignUpDto, data);
    return this.authClient.send('sign-up', signUpDto);
  }

  @Post('auth/refresh')
  async refresh(@Body() data) {
    const refreshToken = plainToInstance(RefreshTokenDto, data);
    return this.authClient.send('refresh', refreshToken);
  }

  @Post('auth/logout')
  async logout(@Body() data) {
    const refreshToken = plainToInstance(RefreshTokenDto, data);
    await this.authClient.emit('logout', refreshToken);
  }
}
