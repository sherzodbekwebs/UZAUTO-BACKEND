import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CrmService } from './crm.service';
import { CreateCrmDto } from './dto/create-crm.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  // 🔓 OCHIQ: Saytdagi "Aloqa/Qo'ng'iroq qiling" formasi uchun
  @Post()
  create(@Body() createCrmDto: CreateCrmDto) {
    return this.crmService.create(createCrmDto);
  }

  // 🔐 FAQAT ADMIN: Barcha murojaatlarni ko'rish
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.crmService.findAll();
  }

  // 🔐 FAQAT ADMIN: Qo'ng'iroq natijasini o'zgartirish
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { isCalled?: boolean; result?: string }) {
    return this.crmService.update(id, body);
  }

  // 🔐 FAQAT ADMIN: Yozuvni o'chirish
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.crmService.remove(id);
  }
}