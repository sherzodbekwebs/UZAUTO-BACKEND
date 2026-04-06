import { Module } from '@nestjs/common';
import { AffiliatedService } from './affiliated.service';
import { AffiliatedController } from './affiliated.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AffiliatedController],
  providers: [AffiliatedService],
})
export class AffiliatedModule {}