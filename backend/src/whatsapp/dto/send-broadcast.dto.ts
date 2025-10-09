import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from 'class-validator';

export class SendBroadcastDto {
  @IsNotEmpty()
  @IsString()
  templateName: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  contacts: string[];
}

