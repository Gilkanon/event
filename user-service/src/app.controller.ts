import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { SignInUserEntity } from './entities/sign-in-user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('find-all-users')
  async findAllUsers(): Promise<UserEntity[]> {
    const users = await this.appService.findAllUsers();
    return users.map((user) => plainToInstance(UserEntity, user));
  }

  @MessagePattern('find-user-by-id')
  async findUserById(id: number): Promise<UserEntity> {
    const user = await this.appService.findUserById(id);
    return plainToInstance(UserEntity, user);
  }

  @MessagePattern('create-user')
  async createUser(createUserDto: CreateUserDto) {
    const user = await this.appService.createUser(createUserDto);
    return plainToInstance(UserEntity, user);
  }

  @MessagePattern('update-user')
  async updateUser(id: number, updateUserDto: UserEntity): Promise<UserEntity> {
    const user = await this.appService.updateUser(id, updateUserDto);
    return plainToInstance(UserEntity, user);
  }

  @EventPattern('delete-user')
  async deleteUser(id: number): Promise<void> {
    await this.appService.deleteUser(id);
  }

  @MessagePattern('find-user-by-email')
  async findUserByEmail(@Payload() data): Promise<SignInUserEntity> {
    const user = await this.appService.findUserByEmail(data);
    return plainToInstance(SignInUserEntity, user);
  }
}
