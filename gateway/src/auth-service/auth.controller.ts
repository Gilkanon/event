import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignInDto } from './dto/sign-in.dto';
import { plainToInstance } from 'class-transformer';

@Controller()
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Post('auth/sign-in')
  async signIn(@Body() data) {
    console.log(data);
    const signInDto = plainToInstance(SignInDto, data);
    console.log(signInDto);
    return this.authClient.send('sign-in', signInDto);
  }
}
