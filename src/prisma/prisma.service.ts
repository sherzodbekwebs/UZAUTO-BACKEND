import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Backend ishga tushganda bazaga ulanadi
  async onModuleInit() {
    await this.$connect();
  }

  // Backend to'xtaganda ulanishni uzadi
  async onModuleDestroy() {
    await this.$disconnect();
  }
}