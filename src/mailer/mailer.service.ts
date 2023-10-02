import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { forgotTemplate } from './templates/forgot';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMailForgotPassword(to, token) {
    const html = forgotTemplate(token);

    return await this.mailerService.sendMail({
      to: to,
      from: 'mitchspiron@outlook.com',
      subject: 'RECUPERATION MOT DE PASSE - ENI QCM',
      html,
    });
  }
}
