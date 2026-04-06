import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class TechSectionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.techSection.findMany({
      orderBy: { order: 'asc' }, // Tartib bo'yicha olish yaxshiroq
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.techSection.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Boʻlim topilmadi');
    return item;
  }

  async create(data: any) {
    return this.prisma.techSection.create({ data });
  }

  // ✏️ UPDATE FUNKSIYASI QO'SHILDI
  async update(id: string, data: any) {
    const item = await this.findOne(id);

    // Agar yangi ikonka kelsa, eskisini o'chiramiz
    if (data.icon && item.icon && data.icon !== item.icon) {
      this.deleteFile(item.icon);
    }

    return this.prisma.techSection.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    if (item.icon) this.deleteFile(item.icon);
    return this.prisma.techSection.delete({ where: { id } });
  }

  private deleteFile(path: string) {
    try {
      const cleanPath = path.startsWith('/') ? path.substring(1) : path;
      const filePath = join(process.cwd(), cleanPath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
      console.error("Fayl o'chirishda xato:", err);
    }
  }
}