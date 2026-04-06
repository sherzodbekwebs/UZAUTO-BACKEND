import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}

  // Barcha menyularni olish (order bo'yicha tartiblangan)
  async findAll() {
    return this.prisma.menu.findMany({
      orderBy: { order: 'asc' },
    });
  }

  // ID bo'yicha bitta menyuni topish
  async findOne(id: string) {
    const menu = await this.prisma.menu.findUnique({ where: { id } });
    if (!menu) throw new NotFoundException('Menyu topilmadi');
    return menu;
  }

  // Yangi menyu qo'shish
  async create(data: any) {
    return this.prisma.menu.create({ data });
  }

  // Menyuni tahrirlash
  async update(id: string, data: any) {
    await this.findOne(id); // Mavjudligini tekshirish
    return this.prisma.menu.update({
      where: { id },
      data,
    });
  }

  // Menyuni o'chirish
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.menu.delete({ where: { id } });
  }
}