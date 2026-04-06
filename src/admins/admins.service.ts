import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
  constructor(private prisma: PrismaService) { }

  // 1. Барча админларни олиш (Паролсиз)
  async findAll() {
    return this.prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // 2. Битта админни ID бўйича топиш (ЯНГИ ҚЎШИЛДИ)
  async findOne(id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });
    if (!admin) throw new NotFoundException('Админ топилмади');
    return admin;
  }

  // 3. Янги админ яратиш
  async create(data: any) {
    const existing = await this.prisma.admin.findUnique({
      where: { username: data.username },
    });

    if (existing) {
      throw new ConflictException('Бу логинли фойдаланувчи аллақачон мавжуд');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.admin.create({
      data: {
        username: data.username,
        password: hashedPassword,
        role: data.role || 'admin',
        isActive: data.isActive === undefined ? true : 
                  (typeof data.isActive === 'string' ? data.isActive === 'true' : data.isActive),
      },
      select: { id: true, username: true, role: true, isActive: true },
    });
  }

  // 4. Админни таҳрирлаш
  async update(id: string, data: any) {
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) throw new NotFoundException('Админ топилмади');

    // Агар username ўзгартирилаётган бўлса, у базада бор-йўқлигини текширамиз
    if (data.username && data.username !== admin.username) {
      const existing = await this.prisma.admin.findUnique({ where: { username: data.username } });
      if (existing) throw new ConflictException('Бу логин банд');
    }

    const updateData: any = {};
    
    if (data.username) updateData.username = data.username;
    if (data.role) updateData.role = data.role;
    
    if (data.isActive !== undefined) {
      updateData.isActive = typeof data.isActive === 'string' 
        ? data.isActive === 'true' 
        : data.isActive;
    }

    if (data.password && data.password.trim() !== "") {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.admin.update({
      where: { id },
      data: updateData,
      select: { id: true, username: true, role: true, isActive: true },
    });
  }

  // 5. Админни ўчириш
  async remove(id: string) {
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) throw new NotFoundException('Админ топилмади');

    return this.prisma.admin.delete({ where: { id } });
  }
}