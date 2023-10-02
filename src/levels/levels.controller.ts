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
import { LevelsService } from './levels.service';
import { Levels } from './types';
import { LevelsDto } from './dto';

@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Get()
  async getLevels(): Promise<Levels[]> {
    return await this.levelsService.getLevels();
  }

  @Get('/:slug')
  async getLevelsBySlug(@Param('slug') slug: string): Promise<Levels> {
    return await this.levelsService.getLevelsBySlug(slug);
  }

  @Post()
  async createLevels(@Body() dto: LevelsDto): Promise<Levels> {
    return await this.levelsService.createLevels(dto);
  }

  @Put('/:slug')
  async updateLevelsBySlug(
    @Param('slug') slug: string,
    @Body() dto: LevelsDto,
  ): Promise<Levels> {
    return await this.levelsService.updateLevelsBySlug(slug, dto);
  }

  @Delete('/:id')
  async deleteLevelsById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Levels> {
    return await this.levelsService.deleteLevelsById(id);
  }
}
