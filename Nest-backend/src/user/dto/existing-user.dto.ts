import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ExistingUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
