import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AdvantagesService } from './advantages.service';

// Multer sozlamalari
const multerOptions = {
  storage: diskStorage({
    destination: './uploads/advantages',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `adv-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};

@Controller('advantages')
export class AdvantagesController {
  constructor(private readonly advantagesService: AdvantagesService) {}

  @Get()
  findAll() {
    return this.advantagesService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('icon', multerOptions))
  create(@Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    const data = {
      titleRu: dto.titleRu,
      titleUz: dto.titleUz || null,
      titleEn: dto.titleEn || null,
      icon: file ? `/uploads/advantages/${file.filename}` : null,
      isActive: dto.isActive === 'false' ? false : true,
    };
    return this.advantagesService.create(data);
  }

  // ✏️ UPDATE (PATCH) ENDPOINT
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('icon', multerOptions))
  async update(
    @Param('id') id: string, 
    @Body() dto: any, 
    @UploadedFile() file: Express.Multer.File
  ) {
    const updateData = { ...dto };

    // Yangi ikonka bo'lsa yo'lini yangilaymiz
    if (file) {
      updateData.icon = `/uploads/advantages/${file.filename}`;
    }

    // isActive ni stringdan boolean holatga o'tkazish
    if (dto.isActive !== undefined) {
      updateData.isActive = dto.isActive === 'true' || dto.isActive === true;
    }

    return this.advantagesService.update(id, updateData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.advantagesService.remove(id);
  }
}