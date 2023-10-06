import { Module } from '@nestjs/common';
import { UserTestController } from './user-test.controller';
import { UserTestService } from './user-test.service';

@Module({
  imports: [],
  controllers: [UserTestController],
  providers: [UserTestService],
})
export class UserTestModule {}
