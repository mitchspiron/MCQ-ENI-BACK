import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { UserAnswerService } from './user-answer.service';
import { GetUserAnswer, UserAnswer } from './types';
import { SwitchIsCorrectDto, UserAnswerDto } from './dto';

@Controller('user-answer')
export class UserAnswerController {
  constructor(private readonly userAnswerService: UserAnswerService) {}

  @Get('/:user/:slug')
  async getUserAnswerByTestSlug(
    @Param('user', ParseIntPipe) user: number,
    @Param('slug') slug: string,
  ): Promise<GetUserAnswer[]> {
    return await this.userAnswerService.getUserAnswerByTestSlug(user, slug);
  }

  @Post()
  async createUserAnswer(@Body() dto: UserAnswerDto): Promise<UserAnswer> {
    return await this.userAnswerService.createUserAnswer(dto);
  }

  @Put('/is-correct/:id/:user')
  async switchIsCorrectById(
    @Param('id', ParseIntPipe) id: number,
    @Param('user', ParseIntPipe) user: number,
    @Body() dto: SwitchIsCorrectDto,
  ): Promise<UserAnswer> {
    return await this.userAnswerService.switchIsCorrectById(id, user, dto);
  }

  @Put('/is-corrected/:id/:user')
  async updateUserAnswerToCorrected(
    @Param('id', ParseIntPipe) id: number,
    @Param('user', ParseIntPipe) user: number,
  ): Promise<UserAnswer> {
    return await this.userAnswerService.updateUserAnswerToCorrected(id, user);
  }
}
