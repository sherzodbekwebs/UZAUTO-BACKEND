import { Controller, Get, Post, Body, Param, Delete, Patch, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ManagementService } from './management.service';

@Controller('management')
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @Get()
  findAll() { return this.managementService.findAll(); }

  // ❗ MANA SHU METOD QOLIB KETGAN EDI (Siz yuborgan kodda yo'q edi):
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.managementService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/management',
      filename: (req, file, cb) => cb(null, Date.now() + extname(file.originalname)),
    }),
  }))
  create(@Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    const imageUrl = file ? `/uploads/management/${file.filename}` : null;
    return this.managementService.create({
      ...dto,
      image: imageUrl,
      order: parseInt(dto.order) || 0,
      isActive: dto.isActive === 'false' ? false : true,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/management',
      filename: (req, file, cb) => cb(null, Date.now() + extname(file.originalname)),
    }),
  }))
  update(@Param('id') id: string, @Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    const data = { ...dto };
    if (file) data.image = `/uploads/management/${file.filename}`;
    
    // Tiplarni o'girish
    if (dto.order) data.order = parseInt(dto.order);
    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive === 'true' || dto.isActive === true;
    }

    return this.managementService.update(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) { return this.managementService.remove(id); }
}