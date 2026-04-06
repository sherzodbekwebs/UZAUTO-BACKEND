import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class AdvantagesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.advantage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.advantage.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Afzallik topilmadi');
    return item;
  }

  async create(data: any) {
    return this.prisma.advantage.create({ data });
  }

  // ✏️ UPDATE MANTIQI
  async update(id: string, data: any) {
    const item = await this.findOne(id);

    // Agar yangi ikonka yuklansa va eskisidan farq qilsa, eskisini o'chiramiz
    if (data.icon && item.icon && data.icon !== item.icon) {
      this.deleteFile(item.icon);
    }

    return this.prisma.advantage.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    if (item.icon) {
      this.deleteFile(item.icon);
    }
    return this.prisma.advantage.delete({ where: { id } });
  }

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