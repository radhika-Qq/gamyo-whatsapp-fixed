import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  mediaId?: string;

  @IsOptional()
  @IsNumber()
  scheduledTime?: number; // Unix timestamp for scheduled publishing
}

