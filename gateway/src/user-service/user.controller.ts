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
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateUserDto } from './user_model/update-user.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller()
export class UserController {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  @UseGuards(JwtAuthGuard)
  @Post('users/email/')
  async findUserByEmail(@Body() data) {
    return this.userClient.send('find-user-by-email', data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async findAllUsers() {
    return this.userClient.send('find-all-users', {});
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  async findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userClient.send('find-user-by-id', id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('users/update/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userClient.send('update-user', { id, updateUserDto });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('users/delete/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userClient.emit('delete-user', id);
  }
}
