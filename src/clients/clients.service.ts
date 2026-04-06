import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(onlyActive: boolean = false) {
    return this.prisma.client.findMany({
      where: onlyActive ? { isActive: true } : {},
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) throw new NotFoundException('Mijoz topilmadi');
    return client;
  }

  async create(data: any) {
    return this.prisma.client.create({ data });
  }

  async update(id: string, data: any) {
    const client = await this.findOne(id);
    
    // Yangi logo yuklansa, eskisini o'chirish
    if (data.logo && client.logo && data.logo !== client.logo) {
      this.deleteFile(client.logo);
    }

    return this.prisma.client.update({ where: { id }, data });
  }

  async remove(id: string) {
    const client = await this.findOne(id);
    this.deleteFile(client.logo);
    return this.prisma.client.delete({ where: { id } });
  }

  private deleteFile(path: string) {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const filePath = join(process.cwd(), cleanPath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}