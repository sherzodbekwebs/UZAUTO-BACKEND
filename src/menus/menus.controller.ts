import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MenusService } from './menus.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  // 🔓 OCHIQ: Frontend navbar uchun barcha menyularni oladi
  @Get()
  findAll() {
    return this.menusService.findAll();
  }

  // 🔐 FAQAT ADMIN: Yangi menyu qo'shish
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: any) {
    const data = {
      ...dto,
      order: parseInt(dto.order) || 0,
      isActive: dto.isActive === 'false' ? false : true,
    };
    return this.menusService.create(data);
  }

  // 🔐 FAQAT ADMIN: Menyuni tahrirlash
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    const updateData = { ...dto };
    if (dto.order) updateData.order = parseInt(dto.order);
    if (dto.isActive !== undefined) {
      updateData.isActive = dto.isActive === 'true' || dto.isActive === true;
    }
    return this.menusService.update(id, updateData);
  }

  // 🔐 FAQAT ADMIN: Menyuni o'chirish
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menusService.remove(id);
  }
}