import { IsNotEmpty, IsString } from 'class-validator';

export class UploadMediaDto {
  @IsNotEmpty()
  @IsString()
  mediaUrl: string;
}

