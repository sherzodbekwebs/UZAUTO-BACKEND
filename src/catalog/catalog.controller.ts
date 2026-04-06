import { Controller, Get, Post, Body, Param, Delete, Patch, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) { }

  @Get()
  findAll() { return this.catalogService.findAll(); }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/catalog',
      filename: (req, file, cb) => cb(null, Date.now() + extname(file.originalname)),
    }),
  }))
  create(@Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Fayl yuklash majburiy!');
    return this.catalogService.create({
      ...dto,
      fileUrl: `/uploads/catalog/${file.filename}`,
      order: parseInt(dto.order) || 0,
      isActive: dto.isActive === 'false' ? false : true,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/catalog',
      filename: (req, file, cb) => cb(null, Date.now() + extname(file.originalname)),
    }),
  }))
  update(@Param('id') id: string, @Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    const data = { ...dto };
    if (file) data.fileUrl = `/uploads/catalog/${file.filename}`;
    if (dto.order) data.order = parseInt(dto.order);
    if (dto.isActive !== undefined) data.isActive = dto.isActive === 'true' || dto.isActive === true;
    return this.catalogService.update(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) { return this.catalogService.remove(id); }
}