import {
  Controller, Get, Post, Body, Param, Delete, Patch,
  UseInterceptors, UploadedFiles, UseGuards, Query
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';

const multerOptions = {
  storage: diskStorage({
    destination: './uploads/products',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  findAll(@Query('categoryId') categoryId: string) {
    const filter = categoryId ? { categoryId } : {};
    return this.productsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ], multerOptions))
  async create(
    @Body() dto: any,
    @UploadedFiles() files: any
  ) {
    const productData = this.prepareData(dto, files);
    return this.productsService.create(productData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ], multerOptions))
  async update(
    @Param('id') id: string,
    @Body() dto: any,
    @UploadedFiles() files: any
  ) {
    const updateData = this.prepareData(dto, files, true);
    return this.productsService.update(id, updateData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  private prepareData(dto: any, files: any, isUpdate = false) {
    const data = { ...dto };

    // 1. Rasmlar
    if (files?.image?.[0]) data.image = `/uploads/products/${files.image[0].filename}`;
    else if (isUpdate && !dto.image) delete data.image;

    if (files?.bannerImage?.[0]) data.bannerImage = `/uploads/products/${files.bannerImage[0].filename}`;
    else if (isUpdate && !dto.bannerImage) delete data.bannerImage;

    if (files?.gallery && files.gallery.length > 0) {
      data.gallery = files.gallery.map(f => `/uploads/products/${f.filename}`);
    } else if (isUpdate && !dto.gallery) delete data.gallery;

    // 2. Boolean va Number o'girish
    if (dto.isActive !== undefined) data.isActive = dto.isActive === 'true' || dto.isActive === true;
    if (dto.inStock !== undefined) data.inStock = dto.inStock === 'true' || dto.inStock === true;
    if (dto.order !== undefined) data.order = Number(dto.order);

    // 3. Afzalliklar (advantageIds) va Texnik Xususiyatlar (techSpecs)
    // Frontenddan advantageIds: ["uuid1", "uuid2"] bo'lib kelishi kerak
    if (typeof dto.advantageIds === 'string' && dto.advantageIds.trim() !== "") {
      data.advantageIds = JSON.parse(dto.advantageIds);
    }

    // Frontenddan techSpecs: [{"sectionId": "...", "keyRu": "...", "valRu": "..."}] bo'lib kelishi kerak
    if (typeof dto.techSpecs === 'string' && dto.techSpecs.trim() !== "") {
      data.techSpecs = JSON.parse(dto.techSpecs);
    }

    return data;
  }
}