import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findAll')
  async findAll() {
    try {
      const users = await this.userService.findAll();
      return { success: true, data: users };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findUserById/:id')
  @CacheTTL(30)
  async findUserById(@Param('id') id: string) {
    try {
      const user = await this.userService.findUserById(+id);
      return { user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('/:id')
  async getPokemon(@Param('id') id: number) {
    try {
      const data = await this.userService.getPokemon(id);
      return { success: true, data: data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
}
