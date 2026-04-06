import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) { }


  async getStats() {
    const [totalProducts, activeUsers, newAppeals, newsViews] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.admin.count({ where: { isActive: true } }),
      this.prisma.appeal.count(),
      this.prisma.news.aggregate({ _sum: { views: true } }),
    ]);

    // Охирги 5 та янгиликни оламиз (Activity учун)
    const recentNews = await this.prisma.news.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        titleRu: true,
        titleUz: true,
        titleEn: true,
        createdAt: true,
      },
    });

    return {
      stats: {
        totalProducts,
        activeUsers,
        newAppeals,
        totalNewsViews: newsViews._sum.views || 0,
      },
      // Ҳаракатлар рўйхатини шакллантирамиз
      recentActivity: recentNews.map((news) => ({
        id: news.id,
        type: 'news',   // Тур: янгилик
        action: 'added', // Ҳаракат: қўшилди
        user: 'Admin',   // Ким томонидан
        // 3 та тилдаги номларни юборамиз
        targetRu: news.titleRu,
        targetUz: news.titleUz,
        targetEn: news.titleEn,
        time: news.createdAt,
      })),
    };
  }

  async findAll(onlyActive: boolean = false) {
    return this.prisma.news.findMany({
      where: onlyActive ? { isActive: true } : {},
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const news = await this.prisma.news.findUnique({ where: { id } });
    if (!news) throw new NotFoundException('Yangilik topilmadi');
    return news;
  }

  async create(data: any) {
    return this.prisma.news.create({ data });
  }

  async remove(id: string) {
    const news = await this.findOne(id);
    if (news.image) {
      const cleanPath = news.image.startsWith('/') ? news.image.substring(1) : news.image;
      const filePath = join(process.cwd(), cleanPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    return this.prisma.news.delete({ where: { id } });
  }

  async update(id: string, data: any) {
    const news = await this.findOne(id);

    // Agar yangi rasm yuklansa, eskisini o'chirib tashlaymiz
    if (data.image && news.image && data.image !== news.image) {
      const cleanPath = news.image.startsWith('/') ? news.image.substring(1) : news.image;
      const oldFilePath = join(process.cwd(), cleanPath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    return this.prisma.news.update({
      where: { id },
      data,
    });
  }

  async incrementViews(id: string) {
    return this.prisma.news.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }
}