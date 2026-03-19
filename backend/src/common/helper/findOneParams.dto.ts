import { IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindOneParams {
  @ApiProperty({ example: '1' })
  @IsNumberString()
  id: number;
}
