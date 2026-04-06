import { Module } from '@nestjs/common';
import { TechSectionsService } from './tech-sections.service';
import { TechSectionsController } from './tech-sections.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TechSectionsController],
  providers: [TechSectionsService],
})
export class TechSectionsModule {}