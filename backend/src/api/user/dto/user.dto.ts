import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'admin@admin.com' })
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class UserDto {
  @ApiProperty({ example: 1 })
  @Expose()
  public id: number;

  @ApiProperty({ example: 'admin@admin.com' })
  @Expose()
  public email: string;
}
