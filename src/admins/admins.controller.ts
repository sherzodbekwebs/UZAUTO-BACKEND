import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard'; 
import { Roles } from '../auth/roles.decorator';
import { AdminsService } from './admins.service';

@Controller('admins')
@UseGuards(AuthGuard('jwt'), RolesGuard) // 🛡️ Har ikkala Guard barcha metodlar uchun amal qiladi
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  // 1. Barcha adminlar ro'yxatini olish
  @Get()
  @Roles('superadmin') 
  findAll() {
    return this.adminsService.findAll();
  }

  // 2. Bitta admin ma'lumotlarini ID orqali olish (Edit formasi uchun kerak)
  @Get(':id')
  @Roles('superadmin')
  findOne(@Param('id') id: string) {
    // Agar service'da findOne bo'lmasa, qo'shib qo'ying
    return this.adminsService.findOne(id); 
  }

  // 3. Yangi admin qo'shish
  @Post()
  @Roles('superadmin') 
  create(@Body() dto: any) {
    return this.adminsService.create(dto);
  }

  // 4. Admin ma'lumotlarini tahrirlash (Patch)
  @Patch(':id')
  @Roles('superadmin') // 🔐 Faqat superadmin boshqa adminlarni tahrirlay oladi
  update(@Param('id') id: string, @Body() dto: any) {
    return this.adminsService.update(id, dto);
  }

  // 5. Adminni tizimdan o'chirish
  @Delete(':id')
  @Roles('superadmin') 
  remove(@Param('id') id: string) {
    return this.adminsService.remove(id);
  }
}