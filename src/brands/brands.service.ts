import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.brand.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any) {
    return this.prisma.brand.create({
      data,
    });
  }

  // ✏️ TAHRIRLASH MANTIQI
  async update(id: string, data: any) {
    const item = await this.prisma.brand.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Brend topilmadi');

    // Agar yangi logo kelsa va eskisidan farq qilsa, eskisini o'chirib tashlaymiz
    if (data.logo && item.logo && data.logo !== item.logo) {
      this.deleteFile(item.logo);
    }

    return this.prisma.brand.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const item = await this.prisma.brand.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Brend topilmadi');

    if (item.logo) {
      this.deleteFile(item.logo);
    }

    return this.prisma.brand.delete({ where: { id } });
  }

  // Yordamchi funksiya: Serverdagi faylni o'chirish
  private deleteFile(path: string) {
    try {
      const cleanPath = path.startsWith('/') ? path.substring(1) : path;
      const filePath = join(process.cwd(), cleanPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error("Fayl o'chirishda xato:", err);
    }
  }
}