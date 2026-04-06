import { Module } from '@nestjs/common';
import { AnniversarySlidersService } from './anniversary-sliders.service';
import { AnniversarySlidersController } from './anniversary-sliders.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AnniversarySlidersController],
  providers: [AnniversarySlidersService],
})
export class AnniversarySlidersModule {}