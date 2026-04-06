import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards 
} from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  // 🔓 OCHIQ: Saytda ko'rinishi uchun 
  @Get()
  findAll() {
    return this.vacanciesService.findAll();
  }

  // 🔓 OCHIQ: Bitta vakansiya haqida batafsil (ParseIntPipe olib tashlandi)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacanciesService.findOne(id);
  }

  // 🔐 FAQAT ADMIN: Yangi vakansiya qo'shish
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createVacancyDto: CreateVacancyDto) {
    return this.vacanciesService.create(createVacancyDto);
  }

  // 🔐 FAQAT ADMIN: Tahrirlash (ParseIntPipe olib tashlandi)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.vacanciesService.update(id, updateDto);
  }

  // 🔐 FAQAT ADMIN: O'chirish (ParseIntPipe olib tashlandi)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vacanciesService.remove(id);
  }
}