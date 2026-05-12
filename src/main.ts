// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CORS ni hamma narsadan (hatto Helmetdan ham) tepaga qo'ying
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    // BU QATORNI QO'SHING: Brauzerga qaysi headerlarni yuborishga ruxsat berishini aytadi
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With, Apollo-Require-Preflight',
  });

  // 2. Helmet sozlamalari
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Backend is running on port: ${port}`);
}
bootstrap();