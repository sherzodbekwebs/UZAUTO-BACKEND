import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';

@Injectable()
export class VacanciesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVacancyDto) {
    return this.prisma.vacancy.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.vacancy.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // ID turi string ga o'zgartirildi
  async findOne(id: string) {
    const vacancy = await this.prisma.vacancy.findUnique({ where: { id } });
    if (!vacancy) throw new NotFoundException('Vakansiya topilmadi');
    return vacancy;
  }

  // ID turi string ga o'zgartirildi
  async update(id: string, dto: any) {
    await this.findOne(id); // Mavjudligini tekshirish
    return this.prisma.vacancy.update({
      where: { id },
      data: dto,
    });
  }

  // ID turi string ga o'zgartirildi
  async remove(id: string) {
    await this.findOne(id); // Mavjudligini tekshirish
    return this.prisma.vacancy.delete({ where: { id } });
  }
}