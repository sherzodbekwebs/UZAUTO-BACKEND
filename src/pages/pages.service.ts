import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  // 1. Faqat faol yo'llarni (slug) olish - Frontendda 'map' qilish uchun
  async getActiveRoutes() {
    return this.prisma.page.findMany({
      where: { isActive: true },
      select: { slug: true, titleUz: true },
      orderBy: { createdAt: 'asc' }
    });
  }

  // 2. Slug bo'yicha bitta sahifani topish - Sahifa ichidagi ma'lumot uchun
  async findBySlug(slug: string) {
    const page = await this.prisma.page.findUnique({ where: { slug } });
    if (!page) throw new NotFoundException('Bunday sahifa topilmadi');
    return page;
  }

  // 3. Admin uchun barcha sahifalar ro'yxati
  async findAll() {
    return this.prisma.page.findMany({ orderBy: { createdAt: 'desc' } });
  }

  // 4. Yangi sahifa yaratish
  async create(data: any) {
    // Slug band emasligini tekshiramiz
    const existing = await this.prisma.page.findUnique({ where: { slug: data.slug } });
    if (existing) throw new ConflictException('Bu slug allaqachon band!');
    
    return this.prisma.page.create({ data });
  }

  // 5. Sahifani tahrirlash
  async update(id: string, data: any) {
    return this.prisma.page.update({
      where: { id },
      data,
    });
  }

  // 6. Sahifani o'chirish
  async remove(id: string) {
    return this.prisma.page.delete({ where: { id } });
  }
}