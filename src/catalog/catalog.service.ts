import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.catalog.findMany({ orderBy: { order: 'asc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.catalog.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Katalog topilmadi');
    return item;
  }

  async create(data: any) {
    return this.prisma.catalog.create({ data });
  }

  async update(id: string, data: any) {
    const item = await this.findOne(id);
    if (data.fileUrl && item.fileUrl && data.fileUrl !== item.fileUrl) {
      this.deleteFile(item.fileUrl);
    }
    return this.prisma.catalog.update({ where: { id }, data });
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    this.deleteFile(item.fileUrl);
    return this.prisma.catalog.delete({ where: { id } });
  }

  private deleteFile(path: string) {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const filePath = join(process.cwd(), cleanPath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}