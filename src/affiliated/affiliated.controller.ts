import { 
  Controller, Get, Post, Body, Param, Delete, Patch, 
  UseInterceptors, UploadedFile, UseGuards 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AffiliatedService } from './affiliated.service';

@Controller('affiliated')
export class AffiliatedController {
  constructor(private readonly affiliatedService: AffiliatedService) {}

  @Get()
  getAll() {
    return this.affiliatedService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.affiliatedService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('logo', {
    storage: diskStorage({
      destination: './uploads/affiliated',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `company-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  create(@Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    const logoUrl = file ? `/uploads/affiliated/${file.filename}` : null;
    
    // MA'LUMOTLARNI KONVERTATSIYA QILISH (Prisma xato bermasligi uchun)
    const data = {
      ...dto,
      logo: logoUrl,
      // isActive string keladi ("true"/"false"), shuni boolean qilamiz
      isActive: dto.isActive === 'true' || dto.isActive === true ? true : false,
    };
    
    return this.affiliatedService.create(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('logo', {
    storage: diskStorage({
      destination: './uploads/affiliated',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `company-${uniqueSuffix}${extname(file.originalname)}`);
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
      updateData.logo = `/uploads/affiliated/${file.filename}`;
    }

    // Tahrirlashda ham boolean formatga o'tkazamiz
    if (dto.isActive !== undefined) {
      updateData.isActive = dto.isActive === 'true' || dto.isActive === true;
    }

    return this.affiliatedService.update(id, updateData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.affiliatedService.remove(id);
  }
}