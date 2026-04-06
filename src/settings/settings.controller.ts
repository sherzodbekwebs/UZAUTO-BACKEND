import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // 🔓 OCHIQ: Hamma ko'rishi mumkin (Frontend ma'lumot olishi uchun)
  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  // 🔓 OCHIQ: Ma'lum bir kalit bo'yicha qiymatni olish: /settings/key/google_tash
  @Get('key/:key')
  getOne(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  // 🔐 FAQAT ADMIN: Yangi sozlama yaratish
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: { key: string; value: string }) {
    return this.settingsService.create(dto);
  }

  // 🔐 FAQAT ADMIN: Qiymatni tahrirlash (Faqat 'value' o'zgaradi, 'key' o'zgarmasligi kerak)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body('value') value: string) {
    return this.settingsService.update(id, value);
  }

  // 🔐 FAQAT ADMIN: Sozlamani o'chirish
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingsService.remove(id);
  }
}