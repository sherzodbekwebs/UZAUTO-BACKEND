import { 
  Controller, Get, Post, Body, Param, Delete, Patch, 
  UseInterceptors, UploadedFile, UseGuards, BadRequestException, Query 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PartnersService } from './partners.service';

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get()
  findAll(@Query('active') active: string) {
    return this.partnersService.findAll(active === 'true');
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('logo', {
    storage: diskStorage({
      destination: './uploads/partners',
      filename: (req, file, cb) => {
        const name = Date.now() + extname(file.originalname);
        cb(null, name);
      },
    }),
  }))
  create(@Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Logo yuklash majburiy!');

    return this.partnersService.create({
      name: dto.name,
      logo: `/uploads/partners/${file.filename}`,
      order: parseInt(dto.order) || 0,
      isActive: dto.isActive === 'false' ? false : true,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('logo', {
    storage: diskStorage({
      destination: './uploads/partners',
      filename: (req, file, cb) => {
        cb(null, Date.now() + extname(file.originalname));
      },
    }),
  }))
  update(@Param('id') id: string, @Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    const data = { ...dto };
    if (file) data.logo = `/uploads/partners/${file.filename}`;
    if (dto.order) data.order = parseInt(dto.order);
    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive === 'true' || dto.isActive === true;
    }
    
    return this.partnersService.update(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnersService.remove(id);
  }
}