import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma/prisma.service';
import { of } from 'rxjs';
import * as bcrypt from 'bcrypt';

const roundsEnv = process.env.ROUNDS || '10';
const rounds = parseInt(roundsEnv, 10);

describe('Auth-service', () => {
  let service: AppService;
  let prisma: PrismaService;
  let userClient: ClientProxy;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: {
            token: {
              create: jest.fn(),
              delete: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: 'USER_SERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    userClient = module.get<ClientProxy>('USER_SERVICE');
  });

  it('should register new user, sign in and return tokens', async () => {
    const mockUserForSignUp = {
      name: 'test',
      email: 'test@test.com',
      password: 'hashedpassword',
      confirmPassword: 'hashedpassword',
    };

    const hashedPassword = await bcrypt.hash('hashedpassword', rounds);
    const mockReturnedUser = {
      id: 1,
      name: 'test',
      email: 'test@test.com',
      password: hashedPassword,
      role: 'USER',
    };
    userClient.send = jest.fn().mockReturnValue(of(mockReturnedUser));
    jwtService.signAsync = jest.fn().mockResolvedValue('mocked-access-token');

    const result = await service.signUp(mockUserForSignUp);

    expect(userClient.send).toHaveBeenCalledWith(
      'find-user-by-email',
      'test@test.com',
    );
    expect(prisma.token.create).toHaveBeenCalled();
    expect(result).toEqual({
      access_token: 'mocked-access-token',
      refresh_token: expect.any(String),
    });
  });

  it('should sign in an existing user and return tokens', async () => {
    const mockUserForSignIn = {
      email: 'test@test.com',
      password: 'hashedpassword',
    };

    const hashedPassword = await bcrypt.hash('hashedpassword', rounds);
    const mockReturnedUser = {
      id: 1,
      name: 'test',
      email: 'test@test.com',
      password: hashedPassword,
      role: 'USER',
    };

    userClient.send = jest.fn().mockReturnValue(of(mockReturnedUser));
    jwtService.signAsync = jest.fn().mockResolvedValue('mocked-access-token');
    prisma.token.create = jest.fn().mockResolvedValue({});

    const result = await service.signIn(mockUserForSignIn);

    expect(userClient.send).toHaveBeenCalledWith(
      'find-user-by-email',
      'test@test.com',
    );
    expect(prisma.token.create).toHaveBeenCalled();
    expect(result).toEqual({
      access_token: 'mocked-access-token',
      refresh_token: expect.any(String),
    });
  });

  it('should logout user and delete refresh token', async () => {
    const mockToken = {
      refreshToken: 'refresh-token',
    };

    const mockReturnedToken = {
      refreshToken: 'refresh-token',
      id: 1,
    };

    prisma.token.findFirst = jest.fn().mockResolvedValue(mockReturnedToken);
    prisma.token.delete = jest.fn().mockResolvedValue({});

    await service.logout(mockToken);

    expect(prisma.token.delete).toHaveBeenCalledWith({
      where: { id: mockReturnedToken.id },
    });
  });

  it('should refresh tokens if refresh token is valid', async () => {
    const date = Date.now();
    const mockRefreshToken = {
      refreshToken: 'refresh_token',
    };
    const mockReturnedData = {
      id: 1,
      userId: 1,
      refreshToken: 'refresh_token',
      expiresAt: date,
      role: 'USER',
    };

    prisma.token.findFirst = jest.fn().mockResolvedValue(mockReturnedData);
    jwtService.signAsync = jest.fn().mockResolvedValue('mocked-access-token');
    prisma.token.update = jest.fn().mockResolvedValue({});

    const result = await service.refreshTokens(mockRefreshToken);

    expect(prisma.token.findFirst).toHaveBeenCalled();
    expect(prisma.token.update).toHaveBeenCalledWith({
      where: { id: mockReturnedData.id },
      data: { refreshToken: expect.any(String), expiresAt: expect.any(Date) },
    });
    expect(result).toEqual({
      access_token: 'mocked-access-token',
      refresh_token: expect.any(String),
    });
  });
});
