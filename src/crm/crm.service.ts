import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CrmService {
  constructor(private prisma: PrismaService) {}

  // Saytdan mijoz ariza qoldirishi uchun
  async create(data: { name: string; phone: string }) {
    return this.prisma.cRM.create({ data });
  }

  // Admin panel uchun hamma arizalarni olish
  async findAll() {
    return this.prisma.cRM.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Admin qo'ng'iroq natijasini va statusini yangilashi uchun
  async update(id: string, data: { isCalled?: boolean; result?: string }) {
    const entry = await this.prisma.cRM.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('Yozuv topilmadi');

    return this.prisma.cRM.update({
      where: { id },
      data,
    });
  }

  // Arizani o'chirish
  async remove(id: string) {
    const entry = await this.prisma.cRM.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('Yozuv topilmadi');
    
    return this.prisma.cRM.delete({ where: { id } });
  }
}