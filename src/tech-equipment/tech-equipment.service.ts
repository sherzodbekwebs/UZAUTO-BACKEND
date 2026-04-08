import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class TechEquipmentService {
  constructor(private prisma: PrismaService) {}

  // 1. Hammasini olish (Tartiblangan holda)
  async findAll() {
    return this.prisma.techEquipment.findMany({
      orderBy: { order: 'asc' },
    });
  }

  // 2. Bittasini ID bo'yicha olish
  async findOne(id: string) {
    const equipment = await this.prisma.techEquipment.findUnique({ where: { id } });
    if (!equipment) throw new NotFoundException('Uskuna topilmadi');
    return equipment;
  }

  // 3. Yangi qo'shish
  async create(data: any) {
    return this.prisma.techEquipment.create({
      data: {
        ...data,
        order: data.order ? Number(data.order) : 0,
        isActive: data.isActive === 'false' ? false : true,
      },
    });
  }

  // 4. Tahrirlash
  async update(id: string, updateData: any) {
    const equipment = await this.findOne(id);

    // Agar yangi rasm yuklansa, eskisini o'chirish
    if (updateData.image && equipment.image && updateData.image !== equipment.image) {
      this.deleteFile(equipment.image);
    }

    return this.prisma.techEquipment.update({
      where: { id },
      data: {
        ...updateData,
        order: updateData.order ? Number(updateData.order) : equipment.order,
        isActive: updateData.isActive !== undefined 
          ? (updateData.isActive === 'true' || updateData.isActive === true) 
          : equipment.isActive,
      },
    });
  }

  // 5. O'chirish
  async remove(id: string) {
    const equipment = await this.findOne(id);
    if (equipment.image) {
      this.deleteFile(equipment.image);
    }
    return this.prisma.techEquipment.delete({ where: { id } });
  }

  // Faylni diskdan o'chirish uchun yordamchi funksiya
  private deleteFile(path: string) {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const filePath = join(process.cwd(), cleanPath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}