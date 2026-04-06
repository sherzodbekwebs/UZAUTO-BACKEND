import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ManagementService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.management.findMany({ orderBy: { order: 'asc' } });
  }

  async findOne(id: string) {
    const leader = await this.prisma.management.findUnique({ where: { id } });
    if (!leader) throw new NotFoundException('Rahbar topilmadi');
    return leader;
  }

  async create(data: any) { return this.prisma.management.create({ data }); }

  async update(id: string, data: any) {
    const leader = await this.findOne(id);
    if (data.image && leader.image && data.image !== leader.image) {
      this.deleteFile(leader.image);
    }
    return this.prisma.management.update({ where: { id }, data });
  }

  async remove(id: string) {
    const leader = await this.findOne(id);
    if (leader.image) this.deleteFile(leader.image);
    return this.prisma.management.delete({ where: { id } });
  }

  private deleteFile(path: string) {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const filePath = join(process.cwd(), cleanPath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}