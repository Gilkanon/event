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
export class UserController {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  @Post('users/email/')
  async findUserByEmail(@Body() data) {
    return this.userClient.send('find-user-by-email', data);
  }

  @Get('users')
  async findAllUsers() {
    return this.userClient.send('find-all-users', {});
  }

  @Get('users/:id')
  async findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userClient.send('find-user-by-id', id);
  }

  @Post('users/create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userClient.emit('create-user', createUserDto);
  }

  @Patch('users/update/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userClient.send('update-user', { id, updateUserDto });
  }

  @Delete('users/delete/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userClient.emit('delete-user', id);
  }
}
