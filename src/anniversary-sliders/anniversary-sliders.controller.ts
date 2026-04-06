import { 
  Controller, Get, Post, Body, Param, Delete, Patch, 
  UseInterceptors, UploadedFile, UseGuards, BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AnniversarySlidersService } from './anniversary-sliders.service';

@Controller('anniversary-sliders')
export class AnniversarySlidersController {
  constructor(private readonly anniversarySlidersService: AnniversarySlidersService) {}

  @Get() // Ochiq yo'l
  findAll() {
    return this.anniversarySlidersService.findAll();
  }

  @UseGuards(AuthGuard('jwt')) // Faqat Admin uchun
  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/anniversary', // Alohida papka
      filename: (req, file, cb) => {
        const name = Date.now() + extname(file.originalname);
        cb(null, name);
      },
    }),
  }))
  create(
    @Body() dto: { order: string; isActive: string }, 
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) throw new BadRequestException('Rasm yuklash majburiy!');

    return this.anniversarySlidersService.create({
      image: `/uploads/anniversary/${file.filename}`,
      order: parseInt(dto.order) || 0,
      isActive: dto.isActive === 'false' ? false : true,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    if (dto.order) dto.order = parseInt(dto.order);
    if (dto.isActive !== undefined) {
        dto.isActive = dto.isActive === 'true' || dto.isActive === true;
    }
    return this.anniversarySlidersService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.anniversarySlidersService.remove(id);
  }
}