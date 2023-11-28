import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as session from 'express-session';
import { flash } from 'express-flash-message';
import * as cookieParser from 'cookie-parser';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe(/* {
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    } */),
  );
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  app.use(cookieParser());

  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
    }),
  );

  app.use(flash({ sessionKeyName: 'flashMessage' }));

  app.enableCors({
    allowedHeaders:
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization',
    origin: process.env.URL_FRONT || '*', // or true
    credentials: true, // If your application allows credentials
  });

  await app.listen(process.env.PORT);
  console.log('🚀 Server started at ' + process.env.URL_BACK);
}
bootstrap();
