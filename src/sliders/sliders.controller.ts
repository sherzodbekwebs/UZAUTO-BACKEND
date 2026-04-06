import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Patch } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SlidersService } from './sliders.service';
import { BadRequestException } from '@nestjs/common';

@Controller('sliders')
export class SlidersController {
  constructor(private readonly slidersService: SlidersService) { }

  @Get() // Hamma ko'rishi mumkin
  findAll() {
    return this.slidersService.findAll(false);
  }

  @UseGuards(AuthGuard('jwt')) // Faqat admin uchun
  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/sliders', // Rasmlar shu yerga tushadi
      filename: (req, file, cb) => {
        const uniqueName = Date.now() + extname(file.originalname);
        cb(null, uniqueName);
      },
    }),
  }))
  create(@Body() dto: { order: string; isActive: string }, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Slayder uchun rasm yuklash majburiy!');
    }
    const imageUrl = `/uploads/sliders/${file.filename}`;
    return this.slidersService.create({
      image: imageUrl,
      order: parseInt(dto.order) || 0,
      isActive: dto.isActive === 'true' || dto.isActive === undefined ? true : false,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id') // Tahrirlash uchun PATCH
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/sliders',
      filename: (req, file, cb) => {
        const uniqueName = Date.now() + extname(file.originalname);
        cb(null, uniqueName);
      },
    }),
  }))
  update(
    @Param('id') id: string,
    @Body() dto: { order: string; isActive: string },
    @UploadedFile() file: Express.Multer.File
  ) {
    const updateData: any = {
      order: parseInt(dto.order),
      isActive: dto.isActive === 'true' || (dto.isActive as any) === true
    };

    if (file) {
      updateData.image = `/uploads/sliders/${file.filename}`;
    }

    return this.slidersService.update(id, updateData);
  }

  @UseGuards(AuthGuard('jwt')) // Faqat admin uchun
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.slidersService.remove(id);
  }
}