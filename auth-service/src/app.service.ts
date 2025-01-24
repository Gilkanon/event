import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable, map } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async signIn(data: any) {
    console.log(data);
    const { email, password } = data;
    console.log('email:', email);
    console.log('password:', password);
    const user = await firstValueFrom(
      this.userClient.send('find-user-by-email', email),
    );
    console.log(user);
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const payload = { email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
