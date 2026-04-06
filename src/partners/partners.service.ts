import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  async findAll(onlyActive: boolean = false) {
    return this.prisma.partner.findMany({
      where: onlyActive ? { isActive: true } : {},
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const partner = await this.prisma.partner.findUnique({ where: { id } });
    if (!partner) throw new NotFoundException('Hamkor topilmadi');
    return partner;
  }

  async create(data: any) {
    return this.prisma.partner.create({ data });
  }

  async update(id: string, data: any) {
    const partner = await this.findOne(id);
    
    // Agar yangi logo yuklansa, eskisini o'chirish
    if (data.logo && partner.logo && data.logo !== partner.logo) {
      this.deleteFile(partner.logo);
    }

    return this.prisma.partner.update({ where: { id }, data });
  }

  async remove(id: string) {
    const partner = await this.findOne(id);
    this.deleteFile(partner.logo);
    return this.prisma.partner.delete({ where: { id } });
  }

  private deleteFile(path: string) {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const filePath = join(process.cwd(), cleanPath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}