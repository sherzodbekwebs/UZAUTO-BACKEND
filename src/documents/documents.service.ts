import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(onlyActive: boolean = false) {
    return this.prisma.document.findMany({
      where: onlyActive ? { isActive: true } : {},
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Hujjat topilmadi'); 
    return doc;
  }

  async create(data: any) {
    return this.prisma.document.create({ data });
  }

  async update(id: string, data: any) {
    const doc = await this.findOne(id);
    
    // Agar yangi fayl yuklansa, eskisini o'chiramiz
    if (data.fileUrl && doc.fileUrl && data.fileUrl !== doc.fileUrl) {
      this.deleteFile(doc.fileUrl);
    }

    return this.prisma.document.update({ where: { id }, data });
  }

  async remove(id: string) {
    const doc = await this.findOne(id);
    if (doc.fileUrl) this.deleteFile(doc.fileUrl);
    return this.prisma.document.delete({ where: { id } });
  }

  private deleteFile(path: string) {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const filePath = join(process.cwd(), cleanPath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}