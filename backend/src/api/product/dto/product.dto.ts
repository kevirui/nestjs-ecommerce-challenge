import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { variationTypesKeys } from 'src/database/entities/product.entity';
import { ProductDetails, ProductDetailsTypeFn } from './productDetails';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  public categoryId: number;
}

export class ProductDetailsDto {
  @ApiProperty({ example: 'Product Title' })
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({ example: 'PRD-001' })
  @IsString()
  @IsNotEmpty()
  public code: string;

  @ApiProperty({ enum: variationTypesKeys, example: 'NONE' })
  @IsDefined()
  @IsString()
  @IsIn(variationTypesKeys)
  public variationType: string;

  @ApiProperty({
    example: {
      category: 'Computers',
      capacity: 512,
      capacityUnit: 'GB',
      capacityType: 'SSD',
      brand: 'Dell',
      series: 'XPS',
    },
  })
  @IsDefined()
  @Type(ProductDetailsTypeFn)
  @ValidateNested()
  public details: ProductDetails;

  @ApiProperty({ example: ['Feature 1', 'Feature 2'] })
  @ArrayMinSize(1)
  @IsString({ each: true })
  public about: string[];

  @ApiProperty({ example: 'Product description goes here' })
  @IsString()
  @IsNotEmpty()
  public description: string;
}
