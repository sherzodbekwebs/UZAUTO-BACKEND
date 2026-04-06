import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class SlidersService {
  constructor(private prisma: PrismaService) { }

  // Barcha slayderlarni tartibi bo'yicha olish
  async findAll(onlyActive: boolean = false) {
    return this.prisma.slider.findMany({
      where: onlyActive ? { isActive: true } : {}, // Agar sayt uchun bo'lsa faqat true'larni oladi
      orderBy: { order: 'asc' },
    });
  }

  // Yangi slayder yaratish
  async create(data: { image: string; order: number; isActive: boolean }) {
    return this.prisma.slider.create({ data });
  }

  async update(id: string, data: any) {
    const slider = await this.prisma.slider.findUnique({ where: { id } });
    if (!slider) throw new NotFoundException('Slayder topilmadi');

    // Agar yangi rasm yuklansa, eski rasmni papkadan o'chirib tashlaymiz
    if (data.image && slider.image) {
      const cleanPath = slider.image.startsWith('/') ? slider.image.substring(1) : slider.image;
      const oldFilePath = join(process.cwd(), cleanPath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    return this.prisma.slider.update({
      where: { id },
      data,
    });
  }

  // Slayderni o'chirish (rasm bilan birga)
  async remove(id: string) {
    const slider = await this.prisma.slider.findUnique({ where: { id } });
    if (!slider) throw new NotFoundException('Slayder topilmadi');

    // Rasmni papkadan o'chirish
    const cleanPath = slider.image.startsWith('/') ? slider.image.substring(1) : slider.image;
    const filePath = join(process.cwd(), cleanPath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return this.prisma.slider.delete({ where: { id } });
  }
}