import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComplianceService {
  constructor(private prisma: PrismaService) {}

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

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.complianceReport.delete({
      where: { id },
    });
  }
}