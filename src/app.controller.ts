import { Controller, Get, Req, Res } from '@nestjs/common';
import { Public } from './common/decorators';

@Controller()
export class AppController {
  @Public()
  @Get('/flash-test')
  async test(@Req() req, @Res() res) {
    await req.flash('info', 'Flash is back!');
    res.redirect('/bienvenu');
  }

  @Public()
  @Get('/bienvenu')
  async welcome(@Req() req, @Res() res) {
    const messages = await req.consumeFlash('info');
    console.log(messages);
    if (messages.length) {
      res.render('welcome.ejs', { messages });
    } else {
      res.send('session expiré ');
    }
  }
}
