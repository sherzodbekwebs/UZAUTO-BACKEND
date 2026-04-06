import {
  Controller, Get, Post, Body, Param, Delete, Patch,
  UseInterceptors, UploadedFile, UseGuards, Query
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/news',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  create(@Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    const imageUrl = file ? `/uploads/news/${file.filename}` : null;
    
    return this.newsService.create({ 
      ...dto, 
      image: imageUrl,
      // Boolean formatga o'tkazish (Frontenddan string bo'lib kelishi mumkin)
      isActive: dto.isActive === 'false' ? false : true 
    });
  }

  @Get()
  getAll(@Query('active') active: string) {
    const onlyActive = active === 'true';
    return this.newsService.findAll(onlyActive);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/news',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  update(
    @Param('id') id: string,
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    const updateData = { ...dto };
    if (file) {
      updateData.image = `/uploads/news/${file.filename}`;
    }

    if (dto.isActive !== undefined) {
      updateData.isActive = dto.isActive === 'true' || dto.isActive === true;
    }

    return this.newsService.update(id, updateData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }

  @Patch(':id/views')
  addValue(@Param('id') id: string) {
    return this.newsService.incrementViews(id);
  }
}