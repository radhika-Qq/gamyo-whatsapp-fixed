import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UploadMediaDto {
  @IsNotEmpty()
  @IsString()
  mediaUrl: string;

  @IsOptional()
  @IsString()
  caption?: string;
}

