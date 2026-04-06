import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.category.findMany({ orderBy: { order: 'asc' } });
    }

    async create(data: any) {
        return this.prisma.category.create({ data });
    }

    async update(id: string, data: any) {
        // Avval bazada borligini tekshiramiz
        const item = await this.prisma.category.findUnique({ where: { id } });
        if (!item) throw new NotFoundException('Kategoriya topilmadi');

        // Agar yangi ikonka kelsa va eskisidan farq qilsa, eskisini o'chiramiz
        if (data.icon && item.icon && data.icon !== item.icon) {
            this.deleteFile(item.icon);
        }

        return this.prisma.category.update({ 
            where: { id }, 
            data: data // Controllerdan kelgan toza ma'lumot
        });
    }

    async remove(id: string) {
        const item = await this.prisma.category.findUnique({ where: { id } });
        if (!item) throw new NotFoundException('Kategoriya topilmadi');

        if (item.icon) this.deleteFile(item.icon);
        return this.prisma.category.delete({ where: { id } });
    }

    private deleteFile(path: string) {
        try {
            const cleanPath = path.startsWith('/') ? path.substring(1) : path;
            const fullPath = join(process.cwd(), cleanPath);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        } catch (error) {
            console.error("Fayl o'chirishda xato:", error);
        }
    }
}