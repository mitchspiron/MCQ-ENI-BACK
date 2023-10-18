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
import { TestsService } from './tests.service';
import { GetTests, Tests } from './types';
import { SwitchIsDoneDto, SwitchIsVisibleDto, TestsDto } from './dto';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Get()
  async getTests(): Promise<GetTests[]> {
    return await this.testsService.getTests();
  }

  @Get('/:slug')
  async getTestsBySlug(@Param('slug') slug: string): Promise<GetTests> {
    return await this.testsService.getTestsBySlug(slug);
  }

  @Get('/levels/:slug')
  async getTestsByLevelsSlug(@Param('slug') slug: string): Promise<GetTests[]> {
    return await this.testsService.getTestsByLevelsSlug(slug);
  }

  @Post()
  async createTests(@Body() dto: TestsDto): Promise<Tests> {
    return await this.testsService.createTests(dto);
  }

  @Put('/:slug')
  async updateTestsBySlug(
    @Param('slug') slug: string,
    @Body() dto: TestsDto,
  ): Promise<GetTests> {
    return await this.testsService.updateTestsBySlug(slug, dto);
  }

  @Put('switch-isvisible/:slug')
  async switchIsVisibleByTestsSlug(
    @Param('slug') slug: string,
    @Body() dto: SwitchIsVisibleDto,
  ): Promise<Tests> {
    return await this.testsService.switchIsVisibleByTestsSlug(slug, dto);
  }

  @Put('switch-isdone/:slug')
  async switchIsDoneByTestsSlug(
    @Param('slug') slug: string,
    @Body() dto: SwitchIsDoneDto,
  ): Promise<Tests> {
    return await this.testsService.switchIsDoneByTestsSlug(slug, dto);
  }

  @Delete('/:id')
  async deleteTestsById(@Param('id', ParseIntPipe) id: number): Promise<Tests> {
    return await this.testsService.deleteTestsById(id);
  }
}
