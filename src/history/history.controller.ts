import { 
  Controller, Get, Post, Body, Param, Delete, Patch, 
  UseInterceptors, UploadedFile, UseGuards 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) { }

  // 🔐 FAQAT ADMIN: Tarix qo'shish
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/history',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  create(@Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    const imageUrl = file ? `/uploads/history/${file.filename}` : null;

    // 🛠 MA'LUMOTLARNI KONVERTATSIYA QILISH
    // FormData hamma narsani string qilib yuborgani uchun Prisma xato bermasligi uchun o'giramiz
    const createData = {
      ...dto,
      image: imageUrl,
      // sortOrder ni raqamga o'tkazish
      sortOrder: dto.sortOrder ? Number(dto.sortOrder) : 0,
      // isActive string ("true"/"false") ni boolean (true/false) ga o'tkazish
      isActive: dto.isActive === 'false' ? false : true 
    };

    return this.historyService.create(createData);
  }

  // 🔓 OCHIQ: Hamma ko'rishi mumkin
  @Get()
  getAll() {
    return this.historyService.findAll();
  }

  // 🔓 OCHIQ: Bitta tarixni ko'rish
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.historyService.findOne(id);
  }

  // 🔐 FAQAT ADMIN: Tahrirlash
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/history',
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
    const updateData: any = { ...dto };

    if (file) {
      updateData.image = `/uploads/history/${file.filename}`;
    }

    // 🛠 TAHRIRLASHDA HAM TURLARNI TO'G'RILASH
    if (dto.sortOrder !== undefined) {
      updateData.sortOrder = Number(dto.sortOrder);
    }
    
    if (dto.isActive !== undefined) {
      updateData.isActive = dto.isActive === 'true' || dto.isActive === true;
    }

    return this.historyService.update(id, updateData);
  }

  // 🔐 FAQAT ADMIN: O'chirish
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historyService.remove(id);
  }
}