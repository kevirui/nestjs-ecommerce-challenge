import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  public userId: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  public roleId: number;
}
