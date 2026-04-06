import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DealersService {
  constructor(private prisma: PrismaService) {}

  // Barcha dilerlarni olish
  async findAll() {
    return this.prisma.dealer.findMany({ 
      orderBy: { createdAt: 'desc' } 
    });
  }

  // Bitta dilerni ID bo'yicha olish (Edit uchun juda muhim)
  async findOne(id: string) {
    const dealer = await this.prisma.dealer.findUnique({ where: { id } });
    if (!dealer) throw new NotFoundException('Diler topilmadi');
    return dealer;
  }

  // Yangi diler qo'shish
  async create(data: any) { 
    return this.prisma.dealer.create({ 
      data 
    }); 
  }

  // Diler ma'lumotlarini yangilash
  async update(id: string, data: any) {
    // Avval borligini tekshiramiz
    await this.findOne(id);
    
    // Bazaga o'zgarmas maydonlar (id, vaqtlar) yuborilmasligi uchun tozalaymiz
    const { id: _, createdAt, updatedAt, ...updateBody } = data;

    return this.prisma.dealer.update({ 
      where: { id }, 
      data: updateBody 
    });
  }

  // Diler o'chirish
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.dealer.delete({ where: { id } });
  }
}