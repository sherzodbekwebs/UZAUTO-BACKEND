import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('compliance') // 🛡️ Frontend endpoint="compliance" ga mos bo'lishi shart
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get()
  @Roles('superadmin') // 🔐 Faqat superadmin ko'ra oladi
  findAll() {
    return this.complianceService.findAll();
  }

  @Get(':id')
  @Roles('superadmin')
  findOne(@Param('id') id: string) {
    return this.complianceService.findOne(id);
  }

  @Delete(':id')
  @Roles('superadmin')
  remove(@Param('id') id: string) {
    return this.complianceService.remove(id);
  }
}