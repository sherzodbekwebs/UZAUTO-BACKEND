import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { AppealsService } from './appeals.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('appeals')
export class AppealsController {
  constructor(private readonly appealsService: AppealsService) {}

  // 🔓 OCHIQ: Saytdan hamma murojaat yo'llashi mumkin
  @Post()
  create(@Body() dto: any) {
    return this.appealsService.create(dto);
  }

  // 🔐 FAQAT ADMIN: Murojaatlar ro'yxatini ko'rish
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.appealsService.findAll();
  }

  // 🔐 FAQAT ADMIN: Bitta murojaatni o'qish
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appealsService.findOne(id);
  }

  // 🔐 FAQAT ADMIN: Murojaatni o'chirib yuborish
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appealsService.remove(id);
  }
}