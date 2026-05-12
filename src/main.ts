// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

// src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://admin.uzautotrailer.uz',
      'https://api.uzautotrailer.uz',
      'https://uzautotrailer.uz',
      'https://www.uzautotrailer.uz',
      'http://localhost:5173',
      'https://uzauto-front.vercel.app'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
  });

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();