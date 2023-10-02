import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from '../mailer/mailer.service';
import { AuthUserController } from './auth-user.controller';
import { AuthUserService } from './auth-user.service';
import { AtStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthUserController],
  providers: [AuthUserService, AtStrategy, MailService],
})
export class AuthUserModule {}
