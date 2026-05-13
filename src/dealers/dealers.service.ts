import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class DealersService {
  private readonly logger = new Logger(DealersService.name);

  constructor(private prisma: PrismaService) { }

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

    // Agar yangi rasm yuklansa, eskisini serverdan o'chirishga harakat qilamiz
    if (data.image && oldDealer.image && oldDealer.image !== data.image) {
      this.deleteFileSafe(oldDealer.image);
    }

    // Bazaga o'zgarmas maydonlar yuborilmasligini ta'minlaymiz
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
      this.deleteFileSafe(dealer.image);
    }

    return this.prisma.dealer.delete({ where: { id } });
  }

  /**
   * Faylni xavfsiz o'chirish (Crash bo'lishini oldini oladi)
   */
  private deleteFileSafe(filePath: string) {
    try {
      // Yo'lni tozalash (agarda yo'l boshida / bo'lsa, join xato qilishi mumkin)
      const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
      const absolutePath = join(process.cwd(), cleanPath);

      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        this.logger.log(`Fayl muvaffaqiyatli o'chirildi: ${absolutePath}`);
      } else {
        this.logger.warn(`Fayl topilmadi, o'chirish o'tkazib yuborildi: ${absolutePath}`);
      }
      // DealersService ichidagi catch blokini mana bunday o'zgartiring:

    } catch (error: any) { // <-- : any qo'shildi
      this.logger.error(`Faylni o'chirishda xatolik yuz berdi: ${error.message}`);
    }
  }
}