import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{10,15}$/, {
    message: 'Phone number must be 10-15 digits without country code prefix symbols',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}

