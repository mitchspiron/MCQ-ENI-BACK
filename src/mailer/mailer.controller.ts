import { Controller } from '@nestjs/common';
import { MailService } from './mailer.service';

@Controller('mailer')
export class MailController {
  constructor(private readonly mailService: MailService) {}
}
