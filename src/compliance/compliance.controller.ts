import { Controller, Get, Param, Delete, UseGuards, Post, Body } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) { }

  // 🔐 FAQAT ADMIN: Hamma murojaatlarni ko'rish
  @UseGuards(AuthGuard('jwt'), RolesGuard) // <-- Faqat shu yerda kerak
  @Get()
  @Roles('superadmin') 
  findAll() {
    return this.complianceService.findAll();
  }

  // 🔐 FAQAT ADMIN: Bittasini ko'rish
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':id')
  @Roles('superadmin')
  findOne(@Param('id') id: string) {
    return this.complianceService.findOne(id);
  }

  // 🔓 OCHIQ: Hamma (mehmonlar ham) xabar yubora olishi kerak
  // Bu yerda UseGuards bo'lmasligi shart!
  @Post('report') 
  create(@Body() dto: any) {
    return this.complianceService.create(dto);
  }

  // 🔐 FAQAT ADMIN: O'chirish
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @Roles('superadmin')
  remove(@Param('id') id: string) {
    return this.complianceService.remove(id);
  }
}