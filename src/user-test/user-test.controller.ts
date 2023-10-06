import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserTestService } from './user-test.service';
import { GetUserTest, UserTest } from './types';
import { UserTestDto } from './dto';

@Controller('user-test')
export class UserTestController {
  constructor(private readonly userTestService: UserTestService) {}

  @Get('/:slug')
  async getUserTestByTestsSlug(
    @Param('slug') slug: string,
  ): Promise<GetUserTest[]> {
    return await this.userTestService.getUserTestByTestsSlug(slug);
  }

  @Post()
  async createUserTest(@Body() dto: UserTestDto): Promise<UserTest> {
    return await this.userTestService.createUserTest(dto);
  }

  @Put('/:slug/:user')
  async updateUserTestState(
    @Param('slug') slug: string,
    @Param('user') user: number,
  ): Promise<UserTest> {
    return await this.userTestService.updateUserTestState(slug, user);
  }
}
