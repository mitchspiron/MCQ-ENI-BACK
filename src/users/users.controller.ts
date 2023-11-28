import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  FilterUsersDto,
  UsersDto,
  UsersInfoDto,
  UsersPasswordDto,
} from './dto';
import {
  Users,
  UsersCreate,
  UsersPassword,
  UserTokenWithoutPassword,
} from './types';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<Users[]> {
    return await this.usersService.getUsers();
  }

  @Post()
  async getUsersByRole(@Body() dto: FilterUsersDto): Promise<Users[]> {
    return await this.usersService.filterUsers(dto);
  }

  @Get('/:slug')
  async getUsersBySlug(@Param('slug') slug: string): Promise<Users> {
    return await this.usersService.getUserBySlug(slug);
  }

  @Post()
  async createUsers(@Body() dto: UsersDto): Promise<UsersCreate> {
    return await this.usersService.createUsers(dto);
  }

  @Put('/info/:slug')
  async updateUsersInfoBySlug(
    @Param('slug') slug: string,
    @Body() dto: UsersInfoDto,
  ): Promise<UserTokenWithoutPassword> {
    return await this.usersService.updateUsersInfoBySlug(slug, dto);
  }

  @Put('/password/:slug')
  async updateUsersPasswordById(
    @Param('slug') slug: string,
    @Body() dto: UsersPasswordDto,
  ): Promise<UsersPassword> {
    return await this.usersService.updateUsersPasswordBySlug(slug, dto);
  }

  @Delete('/:id')
  async deleteUsersById(@Param('id', ParseIntPipe) id: number): Promise<Users> {
    return await this.usersService.deleteUsersById(id);
  }
}
