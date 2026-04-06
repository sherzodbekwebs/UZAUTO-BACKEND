import { 
  Controller, Get, Post, Body, Param, Delete, Patch, 
  UseInterceptors, UploadedFile, UseGuards, BadRequestException, Query 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  findAll(@Query('active') active: string) {
    return this.clientsService.findAll(active === 'true');
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('logo', {
    storage: diskStorage({
      destination: './uploads/clients',
      filename: (req, file, cb) => {
        const name = Date.now() + extname(file.originalname);
        cb(null, name);
      },
    }),
  }))
  create(@Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Logo yuklash majburiy!');

    return this.clientsService.create({
      name: dto.name,
      logo: `/uploads/clients/${file.filename}`,
      order: parseInt(dto.order) || 0,
      isActive: dto.isActive === 'false' ? false : true,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('logo', {
    storage: diskStorage({
      destination: './uploads/clients',
      filename: (req, file, cb) => {
        cb(null, Date.now() + extname(file.originalname));
      },
    }),
  }))
  update(@Param('id') id: string, @Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    const data = { ...dto };
    if (file) data.logo = `/uploads/clients/${file.filename}`;
    if (dto.order) data.order = parseInt(dto.order);
    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive === 'true' || dto.isActive === true;
    }
    
    return this.clientsService.update(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}