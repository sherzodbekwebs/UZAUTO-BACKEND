import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Agar login talab qilinsa

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  // @UseGuards(JwtAuthGuard) // Dashboard faqat adminlar uchun
  async getDashboardStats() {
    return this.dashboardService.getStats();
  }
}