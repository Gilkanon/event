import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './entities/user.entity';
import { PrismaService } from './prisma/prisma.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signUp(data: SignUpDto) {
    const { name, email, password, confirmPassword } = data;
    if (password !== confirmPassword) {
      throw new Error('passwords do not match');
    }

    const user = {
      name: name,
      email: email,
      password: password,
    };

    const newUser = await firstValueFrom(
      this.userClient.send('create-user', user),
    );

    return newUser;
  }

  async signIn(data: SignInDto) {
    const { email, password } = data;
    const user = await firstValueFrom(
      this.userClient.send('find-user-by-email', email),
    );
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const payload = { user_id: user.id, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await bcrypt.hash(accessToken + Date.now(), 10);

    await this.prisma.token.create({
      data: {
        userId: user.id,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        role: user.role,
      },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshTokens(data: RefreshTokenDto) {
    const { refreshToken } = data;
    const storedToken = await this.prisma.token.findFirst({
      where: { refreshToken: refreshToken },
    });

    if (!storedToken) {
      return null;
    }

    if (new Date() > new Date(storedToken.expiresAt)) {
      return null;
    }

    const userId = storedToken.userId;
    const userRole = storedToken.role;
    const newAccessToken = await this.jwtService.signAsync({
      user_id: userId,
      role: userRole,
    });
    const newRefreshToken = await bcrypt.hash(newAccessToken + Date.now(), 10);

    await this.prisma.token.update({
      where: { id: storedToken.id },
      data: {
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  async logout(data: RefreshTokenDto) {
    const { refreshToken } = data;
    const storedToken = await this.prisma.token.findFirst({
      where: { refreshToken: refreshToken },
    });

    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    await this.prisma.token.delete({ where: { id: storedToken.id } });
  }
}
