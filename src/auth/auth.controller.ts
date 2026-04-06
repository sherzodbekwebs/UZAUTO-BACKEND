import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    login(@Body() dto: any) {
        return this.authService.login(dto);
    }

    // Diqqat: Bu faqat bir marta admin yaratib olish uchun!
    @Post('setup-admin')
    setup(@Body() dto: any) {
        return this.authService.createFirstAdmin(dto);
    }
}