import { Module } from '@nestjs/common';
import { AmocrmService } from './amocrm.service';
import { AmocrmController } from './amocrm.controller';
import { ChatGateway } from './chat.gateway';
import { PrismaModule } from '../prisma/prisma.module'; // PrismaModule bor deb hisoblaymiz

@Module({
  imports: [PrismaModule],
  controllers: [AmocrmController],
  providers: [AmocrmService, ChatGateway],
  exports: [AmocrmService],
})
export class AmocrmModule {}