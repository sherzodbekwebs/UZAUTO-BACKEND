import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  // Barcha sozlamalarni olish (Admin uchun)
  async findAll() {
    return this.prisma.setting.findMany({ orderBy: { key: 'asc' } });
  }

  // Bitta sozlamani kalit so'zi bo'yicha olish (Frontend uchun juda muhim)
  async findByKey(key: string) {
    const setting = await this.prisma.setting.findUnique({ where: { key } });
    if (!setting) throw new NotFoundException(`'${key}' kalitli sozlama topilmadi`);
    return setting;
  }

  // Yangi sozlama qo'shish
  async create(data: { key: string; value: string }) {
    const existing = await this.prisma.setting.findUnique({ where: { key: data.key } });
    if (existing) throw new ConflictException('Bu kalit allaqachon mavjud!');
    
    return this.prisma.setting.create({ data });
  }

  // Sozlamani yangilash
  async update(id: string, value: string) {
    return this.prisma.setting.update({
      where: { id },
      data: { value },
    });
  }

  // Sozlamani o'chirish
  async remove(id: string) {
    return this.prisma.setting.delete({ where: { id } });
  }
}