import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async create(data: any) {
    const { categoryId, brandId, advantageIds, techSpecs, ...rest } = data;

    return this.prisma.product.create({
      data: {
        ...rest,
        category: { connect: { id: categoryId } },
        brand: { connect: { id: brandId } },
        // Many-to-Many bog'lanish
        advantages: {
          connect: advantageIds?.map(id => ({ id })) || [],
        },
        // One-to-Many bog'lanish (ProductSpec)
        techSpecs: {
          create: techSpecs?.map(spec => ({
            sectionId: spec.sectionId,
            keyRu: spec.keyRu,
            keyUz: spec.keyUz,
            keyEn: spec.keyEn,
            valRu: spec.valRu,
            valUz: spec.valUz,
            valEn: spec.valEn,
            order: spec.order || 0
          })) || [],
        },
      },
      include: { advantages: true, techSpecs: true },
    });
  }

  async findAll(query?: any) {
    return this.prisma.product.findMany({
      where: query || {},
      include: {
        category: true,
        brand: true,
        advantages: true,
        techSpecs: { include: { section: true } }
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        advantages: true,
        techSpecs: { include: { section: true } }
      },
    });
    if (!product) throw new NotFoundException('Mahsulot topilmadi');
    return product;
  }

  async update(id: string, data: any) {
    await this.findOne(id);

    const {
      categoryId, brandId, advantageIds, techSpecs,
      existingGallery,  // ← BU YERni qo'shing
      id: _, createdAt, updatedAt,
      ...rest
    } = data;

    if (techSpecs) {
      await this.prisma.productSpec.deleteMany({ where: { productId: id } });
    }

    // Gallery: eski yo'llar + yangi yuklangan fayllar
    if (existingGallery) {
      const parsed = typeof existingGallery === 'string'
        ? JSON.parse(existingGallery)
        : existingGallery;
      rest.gallery = parsed;
    }

    const updateData: any = {
      ...rest,
      advantages: advantageIds ? { set: advantageIds.map((id: string) => ({ id })) } : undefined,
      techSpecs: techSpecs ? {
        create: techSpecs.map((spec: any) => ({
          sectionId: spec.sectionId,
          keyRu: spec.keyRu, keyUz: spec.keyUz, keyEn: spec.keyEn,
          valRu: spec.valRu, valUz: spec.valUz, valEn: spec.valEn,
          order: spec.order || 0
        }))
      } : undefined
    };

    if (categoryId && categoryId !== '' && categoryId !== 'undefined') {
      updateData.category = { connect: { id: categoryId } };
    }
    if (brandId && brandId !== '' && brandId !== 'undefined') {
      updateData.brand = { connect: { id: brandId } };
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: { advantages: true, techSpecs: true }
    });
  }
  async remove(id: string) {
    const product = await this.findOne(id);

    const filesToDelete = [product.image, product.bannerImage, ...(product.gallery || [])];

    filesToDelete.forEach(path => {
      if (path && typeof path === 'string') {
        const cleanPath = path.startsWith('/') ? path.substring(1) : path;
        const fullPath = join(process.cwd(), cleanPath);
        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
          } catch (err) {
            console.error(`Faylni o'chirishda xato (${fullPath}):`, err);
          }
        }
      }
    });

    return this.prisma.product.delete({ where: { id } });
  }
}