import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PostContentDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  media?: string;
}

