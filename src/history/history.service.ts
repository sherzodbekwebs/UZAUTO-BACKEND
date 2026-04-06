import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.history.findMany({ orderBy: { sortOrder: 'desc' } });
  }

  async findOne(id: string) {
    const data = await this.prisma.history.findUnique({ where: { id } });
    if (!data) throw new NotFoundException('Ma’lumot topilmadi');
    return data;
  }

  async create(data: any) {
    return this.prisma.history.create({ data });
  }

  async update(id: string, data: any) {
    const history = await this.findOne(id);
    
    // Eski rasmni o'chirish (agar yangi rasm yuklangan bo'lsa)
    if (data.image && history.image && data.image !== history.image) {
      this.deleteFile(history.image);
    }

    return this.prisma.history.update({ where: { id }, data });
  }

  async remove(id: string) {
    const history = await this.findOne(id);
    if (history.image) this.deleteFile(history.image);
    return this.prisma.history.delete({ where: { id } });
  }

  private deleteFile(path: string) {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const filePath = join(process.cwd(), cleanPath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}