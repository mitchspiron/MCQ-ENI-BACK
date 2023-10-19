import { Module } from '@nestjs/common';
import { UserAnswerController } from './user-answer.controller';
import { UserAnswerService } from './user-answer.service';

@Module({
  imports: [],
  controllers: [UserAnswerController],
  providers: [UserAnswerService],
})
export class UserAnswerModule {}
