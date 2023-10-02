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
import { UserRoleService } from './user-role.service';
import { UserRoleDto } from './dto';
import { UserRole } from './types';

@Controller('user-role')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Get()
  async getUserRole(): Promise<UserRole[]> {
    return await this.userRoleService.getUserRole();
  }

  @Get('/:id')
  async getUserRoleById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserRole> {
    return await this.userRoleService.getUserRoleById(id);
  }

  @Post()
  async createUserRole(@Body() dto: UserRoleDto): Promise<UserRole> {
    return await this.userRoleService.createUserRole(dto);
  }

  @Put('/:id')
  async updateUserRoleById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UserRoleDto,
  ): Promise<UserRole> {
    return await this.userRoleService.updateUserRoleById(id, dto);
  }

  @Delete('/:id')
  async deleteUserRoleById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserRole> {
    return await this.userRoleService.deleteUserRoleById(id);
  }
}
