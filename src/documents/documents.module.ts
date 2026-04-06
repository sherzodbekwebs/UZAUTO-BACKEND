// src/documents/documents.module.ts

import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Prisma modulni ulash shart

@Module({
  imports: [PrismaModule], // Ma'lumotlar bazasi bilan ishlash uchun
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}