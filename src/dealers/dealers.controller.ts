import { 
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, 
  UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { DealersService } from './dealers.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
      destination: './uploads/dealers', // Rasmlar saqlanadigan joy
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `dealer-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  create(@Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    const data = {
      ...dto,
      isActive: dto.isActive === 'false' || dto.isActive === false ? false : true,
      image: file ? `/uploads/dealers/${file.filename}` : null, // Rasm yo'li
    };
    return this.dealersService.create(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/dealers',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `dealer-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  update(
    @Param('id') id: string, 
    @Body() dto: any, 
    @UploadedFile() file: Express.Multer.File
  ) {
    const updateData = { ...dto };

    if (dto.isActive !== undefined) {
      updateData.isActive = dto.isActive === 'true' || dto.isActive === true;
    }

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