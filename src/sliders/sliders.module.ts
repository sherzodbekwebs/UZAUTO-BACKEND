import { Module } from '@nestjs/common';
import { SlidersService } from './sliders.service';
import { SlidersController } from './sliders.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Prisma modulni unutmang

@Module({
  imports: [PrismaModule],
  controllers: [SlidersController],
  providers: [SlidersService],
})
export class SlidersModule {}