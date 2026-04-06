import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TechSectionsService } from './tech-sections.service';

@Controller('tech-sections')
export class TechSectionsController {
  constructor(private readonly techSectionsService: TechSectionsService) {}

  @Get()
  findAll() {
    return this.techSectionsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('icon', {
    storage: diskStorage({
      destination: './uploads/tech-sections',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `tech-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  create(@Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    const data = {
      titleRu: dto.titleRu,
      titleUz: dto.titleUz || null,
      titleEn: dto.titleEn || null,
      icon: file ? `/uploads/tech-sections/${file.filename}` : null,
      order: dto.order ? Number(dto.order) : 0, // Numberga o'tkazish shart
      isActive: dto.isActive === 'false' ? false : true,
    };
    return this.techSectionsService.create(data);
  }

  // ✏️ UPDATE (PATCH) ENDPOINT QO'SHILDI
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('icon', {
    storage: diskStorage({
      destination: './uploads/tech-sections',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `tech-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async update(
    @Param('id') id: string, 
    @Body() dto: any, 
    @UploadedFile() file: Express.Multer.File
  ) {
    const updateData = { ...dto };

    if (file) {
      updateData.icon = `/uploads/tech-sections/${file.filename}`;
    }

    if (dto.order) updateData.order = Number(dto.order);
    
    if (dto.isActive !== undefined) {
      updateData.isActive = dto.isActive === 'true' || dto.isActive === true;
    }

    return this.techSectionsService.update(id, updateData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.techSectionsService.remove(id);
  }
}