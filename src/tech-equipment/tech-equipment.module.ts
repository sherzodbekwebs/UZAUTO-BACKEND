import { Module } from '@nestjs/common';
import { TechEquipmentService } from './tech-equipment.service';
import { TechEquipmentController } from './tech-equipment.controller';
import { PrismaModule } from '../prisma/prisma.module'; // PrismaModule yo'lini tekshiring

@Module({
  imports: [PrismaModule],
  controllers: [TechEquipmentController],
  providers: [TechEquipmentService],
})
export class TechEquipmentModule {}