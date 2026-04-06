import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppealsService {
  constructor(private prisma: PrismaService) {}

  // Sayt foydalanuvchisi xabar yuborishi uchun
  async create(data: any) {
    return this.prisma.appeal.create({ data });
  }

  // Admin hamma xabarlarni ko'rishi uchun
  async findAll() {
    return this.prisma.appeal.findMany({
      orderBy: { createdAt: 'desc' }, // Eng yangilari tepada
    });
  }

  // Bitta xabarni ko'rish
  async findOne(id: string) {
    const appeal = await this.prisma.appeal.findUnique({ where: { id } });
    if (!appeal) throw new NotFoundException('Murojaat topilmadi');
    return appeal;
  }

  // Xabarni o'chirish
  async remove(id: string) {
    return this.prisma.appeal.delete({ where: { id } });
  }
}