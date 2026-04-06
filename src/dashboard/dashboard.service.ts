import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // PrismaService yo'lingizni tekshiring

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalProducts, activeUsers, newAppeals, newsViews] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.admin.count({ where: { isActive: true } }),
      this.prisma.appeal.count(),
      this.prisma.news.aggregate({
        _sum: { views: true },
      }),
    ]);

    // Oxirgi harakatlarni olish (Recent Activity)
    const recentNews = await this.prisma.news.findMany({
      take: 2,
      orderBy: { createdAt: 'desc' },
      select: { titleRu: true, createdAt: true, id: true }
    });

    const recentAppeals = await this.prisma.appeal.findMany({
      take: 2,
      orderBy: { createdAt: 'desc' },
      select: { subject: true, createdAt: true, id: true }
    });

    return {
      stats: {
        totalProducts,
        activeUsers,
        newAppeals,
        totalNewsViews: newsViews._sum.views || 0,
      },
      recentActivity: [
        ...recentNews.map(n => ({ id: n.id, type: 'news', title: n.titleRu, time: n.createdAt })),
        ...recentAppeals.map(a => ({ id: a.id, type: 'appeal', title: a.subject, time: a.createdAt }))
      ].sort((a, b) => b.time.getTime() - a.time.getTime())
    };
  }
}