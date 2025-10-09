import { IsNotEmpty, IsString } from 'class-validator';

export class SendChannelDto {
  @IsNotEmpty()
  @IsString()
  message: string;
}

