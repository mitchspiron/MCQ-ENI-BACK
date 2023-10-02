import { Module } from '@nestjs/common';
import { LevelsController } from './levels.controller';
import { LevelsService } from './levels.service';

@Module({
  imports: [],
  controllers: [LevelsController],
  providers: [LevelsService],
})
export class LevelsModule {}
