import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Categories } from 'src/database/entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ComputerDetails {
  @ApiProperty({ example: Categories.Computers, readOnly: true })
  @IsString()
  @IsNotEmpty()
  category = Categories.Computers;

  @ApiProperty({ example: 512 })
  @IsNumber()
  capacity: number;

  @ApiProperty({ example: 'GB', enum: ['GB', 'TB'] })
  @IsString()
  @IsIn(['GB', 'TB'])
  capacityUnit: 'GB' | 'TB';

  @ApiProperty({ example: 'SSD', enum: ['SSD', 'HD'] })
  @IsString()
  @IsIn(['SSD', 'HD'])
  capacityType: 'SSD' | 'HD';

  @ApiProperty({ example: 'Dell' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'XPS' })
  @IsString()
  @IsNotEmpty()
  series: string;
}
