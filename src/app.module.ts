import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthUserModule } from './auth-user/auth-user.module';
import { AtGuard } from './common/guards';
import { UserRoleModule } from './user-role/user-role.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mailer/mailer.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { SocketModule } from './socket/socket.module';
import { LevelsModule } from './levels/levels.module';
import { TestsModule } from './tests/tests.module';
import { UserTestModule } from './user-test/user-test.module';
import { QuestionsModule } from './questions/questions.module';

@Module({
  controllers: [AppController],
  imports: [
    PrismaModule,
    AuthUserModule,
    UserRoleModule,
    MailModule,
    UsersModule,
    SocketModule,
    LevelsModule,
    TestsModule,
    UserTestModule,
    QuestionsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
