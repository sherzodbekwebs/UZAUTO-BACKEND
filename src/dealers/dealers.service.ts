import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class DealersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.dealer.findMany({ 
      orderBy: { createdAt: 'desc' } 
    });
  }

  async findOne(id: string) {
    const dealer = await this.prisma.dealer.findUnique({ where: { id } });
    if (!dealer) throw new NotFoundException('Diler topilmadi');
    return dealer;
  }

  async create(data: any) { 
    return this.prisma.dealer.create({ data }); 
  }

  async update(id: string, data: any) {
    const oldDealer = await this.findOne(id);
    
    // Agar yangi rasm yuklansa, eskisini serverdan o'chirib yuboramiz
    if (data.image && oldDealer.image && oldDealer.image !== data.image) {
      const oldPath = join(process.cwd(), oldDealer.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const { id: _, createdAt, updatedAt, ...updateBody } = data;

    return this.prisma.dealer.update({ 
      where: { id }, 
      data: updateBody 
    });
  }

  async remove(id: string) {
    const dealer = await this.findOne(id);

    // Diler o'chayotganda rasmini ham serverdan o'chiramiz
    if (dealer.image) {
      const path = join(process.cwd(), dealer.image);
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }

    return this.prisma.dealer.delete({ where: { id } });
  }
}