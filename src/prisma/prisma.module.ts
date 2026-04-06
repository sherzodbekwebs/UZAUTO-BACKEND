import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Mana shu decorator uni hamma joyda ishlatish imkonini beradi
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // PrismaService'ni tashqariga chiqaramiz
})
export class PrismaModule {}