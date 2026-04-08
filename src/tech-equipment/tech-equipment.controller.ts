import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseInterceptors, UploadedFile, UseGuards 
} from '@nestjs/common';
import { TechEquipmentService } from './tech-equipment.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';

@Controller('tech-equipment')
export class TechEquipmentController {
  constructor(private readonly techEquipmentService: TechEquipmentService) {}

  // 🔓 OCHIQ: Hamma ko'rishi mumkin
  @Get()
  findAll() {
    return this.techEquipmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.techEquipmentService.findOne(id);
  }

  // 🔐 ADMIN: Yangi uskuna qo'shish
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/tech',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `tech-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  create(@Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    const imageUrl = file ? `/uploads/tech/${file.filename}` : null;
    return this.techEquipmentService.create({ ...dto, image: imageUrl });
  }

  // 🔐 ADMIN: Tahrirlash
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/tech',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `tech-${uniqueSuffix}${extname(file.originalname)}`);
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
      updateData.image = `/uploads/tech/${file.filename}`;
    }
    return this.techEquipmentService.update(id, updateData);
  }

  // 🔐 ADMIN: O'chirish
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.techEquipmentService.remove(id);
  }
}