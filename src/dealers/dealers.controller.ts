import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DealersService } from './dealers.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('dealers')
export class DealersController {
  constructor(private readonly dealersService: DealersService) {}

  @Get()
  findAll() { 
    return this.dealersService.findAll(); 
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dealersService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: any) {
    // Frontenddan kelayotgan ma'lumotlarni sxemaga moslab tozalaymiz
    return this.dealersService.create({
      ...dto,
      // isActive string kelishi mumkin ("true"/"false"), shuni boolean qilamiz
      isActive: dto.isActive === 'false' || dto.isActive === false ? false : true,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    const updateData = { ...dto };

    // Boolean turiga o'tkazish
    if (dto.isActive !== undefined) {
      updateData.isActive = dto.isActive === 'true' || dto.isActive === true;
    }

    return this.dealersService.update(id, updateData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) { 
    return this.dealersService.remove(id); 
  }
}