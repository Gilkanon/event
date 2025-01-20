import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './user_model/create-user.dto';
import { UpdateUserDto } from './user_model/update-user.dto';

@Controller()
export class AppController {
  constructor(@Inject('USER_SERVICE') private rabbitmqClient: ClientProxy) {}

  @Get('users')
  async findAllUsers() {
    return this.rabbitmqClient.send('find-all-users', {});
  }

  @Get('users/:id')
  async findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.rabbitmqClient.send('find-user-by-id', id);
  }

  @Post('users/create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.rabbitmqClient.emit('create-user', createUserDto);
  }

  @Patch('users/update/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.rabbitmqClient.send('update-user', { id, updateUserDto });
  }

  @Delete('users/delete/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.rabbitmqClient.emit('delete-user', id);
  }
}
