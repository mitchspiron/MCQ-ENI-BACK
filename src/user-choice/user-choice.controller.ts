import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { UserChoiceService } from './user-choice.service';
import { GetUserChoice, UserChoice } from './types';
import { UserChoiceDto } from './dto';

@Controller('user-choice')
export class UserChoiceController {
  constructor(private readonly userChoiceService: UserChoiceService) {}

  @Get('/:user/:slug')
  async getUserChoiceByTestSlug(
    @Param('user', ParseIntPipe) user: number,
    @Param('slug') slug: string,
  ): Promise<GetUserChoice[]> {
    return await this.userChoiceService.getUserChoiceByTestSlug(user, slug);
  }

  @Post()
  async createUserChoice(@Body() dto: UserChoiceDto): Promise<UserChoice> {
    return await this.userChoiceService.createUserChoice(dto);
  }
}
