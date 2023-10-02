import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  Req,
} from '@nestjs/common';
import { Public } from '../common/decorators';
import { AuthUserService } from './auth-user.service';
import { AuthUserDtoSignin, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { User, UserToken } from './types';

@Controller('auth-user')
export class AuthUserController {
  constructor(private authService: AuthUserService) {}

  @Public()
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: AuthUserDtoSignin): Promise<UserToken> {
    return this.authService.signin(dto);
  }

  @Public()
  @Get('/verify')
  @HttpCode(HttpStatus.OK)
  isLoggedIn(@Req() req, @Res() res): Promise<any> {
    return this.authService.isLoggedIn(req, res);
  }

  @Public()
  @Post('/forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('/reset-password/:token')
  @HttpCode(HttpStatus.CREATED)
  resetPassword(
    @Body() dto: ResetPasswordDto,
    @Param('token') token,
  ): Promise<User> {
    return this.authService.resetPassword(dto, token);
  }
}
