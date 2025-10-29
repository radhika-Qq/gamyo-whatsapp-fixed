import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export enum MediaType {
  PHOTO = 'photo',
  VIDEO = 'video',
}

export class UploadMediaDto {
  @IsNotEmpty()
  @IsString()
  mediaUrl: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsNotEmpty()
  @IsEnum(MediaType)
  mediaType: MediaType;
}

