import { 
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, 
  UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { DealersService } from './dealers.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Controller('dealers')
export class DealersController {
  constructor(private readonly dealersService: DealersService) {}

  @Get()
  findAll() { 
    return this.dealersService.findAll(); 
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dealersService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const path = './uploads/dealers';
        // Papka mavjudligini tekshirish va yaratish
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path, { recursive: true });
        }
        cb(null, path);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `dealer-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async create(@Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    const data = {
      ...dto,
      // isActive maydonini har doim boolean qilib yuboramiz
      isActive: String(dto.isActive) === 'true',
      // Rasm yo'lini saqlash
      image: file ? `/uploads/dealers/${file.filename}` : null,
    };
    return this.dealersService.create(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({      
      destination: (req, file, cb) => {
        const path = './uploads/dealers';
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path, { recursive: true });
        }
        cb(null, path);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `dealer-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async update(
    @Param('id') id: string, 
    @Body() dto: any, 
    @UploadedFile() file: Express.Multer.File
  ) {
    const updateData = { ...dto };

    // Boolean turiga aniq o'tkazish
    if (dto.isActive !== undefined) {
      updateData.isActive = String(dto.isActive) === 'true';
    }

    // Agar yangi rasm yuklangan bo'lsa, yo'lni yangilaymiz
    if (file) {
      updateData.image = `/uploads/dealers/${file.filename}`;
    }

    return this.dealersService.update(id, updateData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) { 
    return this.dealersService.remove(id); 
  }
}