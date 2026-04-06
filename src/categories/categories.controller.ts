import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() { return this.categoriesService.findAll(); }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('icon', {
    storage: diskStorage({
      destination: './uploads/categories',
      filename: (req, file, cb) => cb(null, `${Date.now()}${extname(file.originalname)}`),
    }),
  }))
  create(@Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    return this.categoriesService.create({
      ...dto,
      icon: file ? `/uploads/categories/${file.filename}` : null,
      order: Number(dto.order) || 0,
      isActive: dto.isActive === 'false' ? false : true,
    });
  }

  // ✏️ UPDATE QISMI SHU YERDA QOLIB KETGAN EDI:
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('icon', {
    storage: diskStorage({
      destination: './uploads/categories',
      filename: (req, file, cb) => cb(null, `${Date.now()}${extname(file.originalname)}`),
    }),
  }))
  update(@Param('id') id: string, @Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    const updateData = { ...dto };

    // Agar yangi rasm yuklangan bo'lsa
    if (file) {
      updateData.icon = `/uploads/categories/${file.filename}`;
    }

    // Tiplarni to'g'irlash (Form-data string qaytaradi)
    if (dto.order) updateData.order = Number(dto.order);
    if (dto.isActive !== undefined) {
      updateData.isActive = dto.isActive === 'true' || dto.isActive === true;
    }

    return this.categoriesService.update(id, updateData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) { return this.categoriesService.remove(id); }
}