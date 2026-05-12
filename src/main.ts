// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  app.enableCors({
    origin: [
      'https://uzautotrailer.uz',
      'https://www.uzautotrailer.uz',
      'https://api.uzautotrailer.uz',
      'https://admin.uzautotrailer.uz', // <--- Buni qo'shing
      'http://admin.uzautotrailer.uz',  // <--- SSL o'rniguncha bu ham kerak
      'http://localhost:5173',
      'http://localhost:3000',
      'https://test.uzautotrailer.uz', // <--- Buni qo'shing
      'http://test.uzautotrailer.uz',  // <--- SSL o'rniguncha bu ham bo'lsin
      'https://uzauto-front.vercel.app',
      'https://uzauto-front-i8t22gw1j-sherzodbekwebs-projects.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Backend is running on port: ${port}`);
}
bootstrap();


// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import helmet from 'helmet';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.use(helmet({
//     crossOriginResourcePolicy: false, // Rasmlar ko'rinishi uchun bu false bo'lishi shart
//   }));

//   // 1. CORS ni serverga moslash
//   app.enableCors({
//     origin: '*', // Hozircha hamma, lekin serverga chiqqanda faqat frontend domeningizni yozasiz
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   });

//   // 2. Portni server dinamik aniqlashi uchun process.env qo'shish
//   const port = process.env.PORT || 3001;
//   await app.listen(port);
//   console.log(`Backend is running on port: ${port}`);
// }
// bootstrap();