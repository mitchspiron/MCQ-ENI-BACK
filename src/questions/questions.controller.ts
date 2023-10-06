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
import { QuestionsService } from './questions.service';
import {
  Choices,
  GetQuestionsToAnswer,
  GetQuestionsToChoice,
  Questions,
} from './types';
import { QuestionsToAnswerDto, QuestionsToChoiceDto } from './dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('/to-answer/:slug')
  async getQuestionsToAnswerByTestsSlug(
    @Param('slug') slug: string,
  ): Promise<GetQuestionsToAnswer[]> {
    return await this.questionsService.getQuestionsToAnswerByTestsSlug(slug);
  }

  @Get('/to-choice/:slug')
  async getQuestionsToChoiceByTestsSlug(
    @Param('slug') slug: string,
  ): Promise<GetQuestionsToChoice[]> {
    return await this.questionsService.getQuestionsToChoiceByTestsSlug(slug);
  }

  @Post('/to-answer')
  async createQuestionToAnswer(
    @Body() dto: QuestionsToAnswerDto,
  ): Promise<GetQuestionsToAnswer> {
    return await this.questionsService.createQuestionToAnswer(dto);
  }

  @Post('/to-choice')
  async createQuestionToChoice(
    @Body() dto: QuestionsToChoiceDto,
  ): Promise<GetQuestionsToChoice> {
    return await this.questionsService.createQuestionToChoice(dto);
  }

  @Put('/to-answer/:id')
  async updateQuestionToAnswerById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: QuestionsToAnswerDto,
  ): Promise<GetQuestionsToAnswer> {
    return await this.questionsService.updateQuestionToAnswerById(id, dto);
  }

  @Put('/to-choice/:id')
  async updateQuestionToChoiceById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: QuestionsToChoiceDto,
  ): Promise<GetQuestionsToChoice> {
    return await this.questionsService.updateQuestionToChoiceById(id, dto);
  }

  @Delete('/to-answer/:id')
  async deleteQuestionToAnswerById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Questions> {
    return await this.questionsService.deleteQuestionToAnswerById(id);
  }

  @Delete('/to-choice/:id')
  async deleteQuestionToChoiceById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Questions> {
    return await this.questionsService.deleteQuestionToChoiceById(id);
  }

  @Delete('/to-choice/choice/:id')
  async deleteChoiceById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Choices> {
    return await this.questionsService.deleteChoiceById(id);
  }
}
