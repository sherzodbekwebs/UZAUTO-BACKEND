import {
    Controller, Get, Post, Body, Patch, Param, Delete,
    UseGuards, Query, BadRequestException
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('pages')
export class PagesController {
    constructor(private readonly pagesService: PagesService) { }

    // 🔓 OCHIQ: Frontend 'map' qilishi uchun faol sluglarni oladi
    @Get('active-routes')
    getActiveRoutes() {
        return this.pagesService.getActiveRoutes();
    }

    // 🔓 OCHIQ: URL'dagi slug orqali sahifa kontentini oladi
    @Get('slug/:slug')
    getBySlug(@Param('slug') slug: string) {
        return this.pagesService.findBySlug(slug);
    }

    // 🔐 ADMIN: Barcha sahifalar listi
    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll() {
        return this.pagesService.findAll();
    }

    // 🔐 ADMIN: Yangi sahifa qo'shish
    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() dto: any) {
        // isActive boolean qilish
        const data = {
            ...dto,
            isActive: dto.isActive === 'false' ? false : true
        };
        return this.pagesService.create(data);
    }

    // 🔐 ADMIN: Sahifani tahrirlash
    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: any) {
        const data = { ...dto };

        if (dto.isActive !== undefined) {
            data.isActive = dto.isActive === 'true' || dto.isActive === true;
        }

        // BU YERDA XATO BERAYOTGAN QATORNI O'CHIRIB, BUNI YOZING:
        return this.pagesService.update(id, data);
    }

    // 🔐 ADMIN: O'chirish
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.pagesService.remove(id);
    }
}