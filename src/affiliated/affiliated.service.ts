import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class AffiliatedService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.affiliatedCompany.findMany({ 
            orderBy: { createdAt: 'desc' } 
        });
    }

    async findOne(id: string) {
        const company = await this.prisma.affiliatedCompany.findUnique({ where: { id } });
        if (!company) throw new NotFoundException('Kompaniya topilmadi');
        return company;
    }

    async create(data: any) {
        return this.prisma.affiliatedCompany.create({ data });
    }

    async update(id: string, data: any) {
        const company = await this.findOne(id);

        // Agar yangi rasm yuklansa, eskisini o'chiramiz
        if (data.logo && company.logo && data.logo !== company.logo) {
            this.deleteFile(company.logo);
        }

        // Bazaga o'zgarmas maydonlar yuborilmasligini ta'minlaymiz
        const { id: _, createdAt, updatedAt, ...rest } = data;

        return this.prisma.affiliatedCompany.update({
            where: { id },
            data: rest,
        });
    }

    async remove(id: string) {
        const company = await this.findOne(id);
        if (company.logo) {
            this.deleteFile(company.logo);
        }
        return this.prisma.affiliatedCompany.delete({ where: { id } });
    }

    private deleteFile(path: string) {
        try {
            const cleanPath = path.startsWith('/') ? path.substring(1) : path;
            const filePath = join(process.cwd(), cleanPath);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error("Fayl o'chirishda xatolik:", error);
        }
    }
}