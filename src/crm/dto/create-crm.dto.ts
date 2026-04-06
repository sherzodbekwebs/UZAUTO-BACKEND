import { IsString, IsOptional } from 'class-validator';

export class CreateCrmDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;
}