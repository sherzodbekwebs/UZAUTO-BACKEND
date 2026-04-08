import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComplianceService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    // 🛡️ DIQQAT: Prisma sxemangizda model nomi 'complianceReport'
    return this.prisma.complianceReport.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const report = await this.prisma.complianceReport.findUnique({
      where: { id },
    });
    if (!report) throw new NotFoundException('Hisobot topilmadi');
    return report;
  }

  // compliance.service.ts
  async create(data: any) {
    return this.prisma.complianceReport.create({
      data: {
        isAnonymous: data.isAnonymous,
        name: data.name || null,
        email: data.email || null,
        subject: data.subject,
        phone: data.phone || null,
        message: data.message,
        pageUrl: data.pageUrl || null, // <--- Shuni ham qo'shing
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.complianceReport.delete({
      where: { id },
    });
  }
}