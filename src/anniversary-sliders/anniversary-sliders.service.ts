import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class AnniversarySlidersService {
  constructor(private prisma: PrismaService) {}

  // Barcha slayderlarni tartibi bo'yicha olish
  async findAll() {
    return this.prisma.anniversarySlider.findMany({
      orderBy: { order: 'asc' },
    });
  }

  // ID bo'yicha bittasini topish
  async findOne(id: string) {
    const slider = await this.prisma.anniversarySlider.findUnique({ where: { id } });
    if (!slider) throw new NotFoundException('Slayder topilmadi');
    return slider;
  }

  // Yangi slayder yaratish
  async create(data: { image: string; order: number; isActive: boolean }) {
    return this.prisma.anniversarySlider.create({ data });
  }

  // Slayderni tahrirlash (Update)
  async update(id: string, data: any) {
    await this.findOne(id); // Mavjudligini tekshirish
    return this.prisma.anniversarySlider.update({
      where: { id },
      data,
    });
  }

  // Slayderni o'chirish va rasmini papkadan yo'qotish
  async remove(id: string) {
    const slider = await this.findOne(id);
    
    const cleanPath = slider.image.startsWith('/') ? slider.image.substring(1) : slider.image;
    const filePath = join(process.cwd(), cleanPath);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return this.prisma.anniversarySlider.delete({ where: { id } });
  }
}