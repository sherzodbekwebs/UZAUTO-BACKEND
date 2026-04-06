import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHistoryDto {
  @Type(() => Number)
  @IsInt()
  sortOrder: number;

  @IsString()
  year: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsString()
  titleUz: string;
  @IsString()
  titleRu: string;
  @IsString()
  titleEn: string;

  @IsString()
  descUz: string;
  @IsString()
  descRu: string;
  @IsString()
  descEn: string;

  @IsOptional()
  isActive?: boolean;
}