import { Module } from '@nestjs/common';
import { UserChoiceController } from './user-choice.controller';
import { UserChoiceService } from './user-choice.service';

@Module({
  imports: [],
  controllers: [UserChoiceController],
  providers: [UserChoiceService],
})
export class UserChoiceModule {}
