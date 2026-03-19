import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Auth } from 'src/api/auth/guards/auth.decorator';
import { AssignRoleDto } from '../dto/role.dto';
import { RoleIds } from '../enum/role.enum';
import { RoleService } from '../services/role.service';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Auth(RoleIds.Admin)
  @ApiBearerAuth()
  @Post('assign')
  @ApiOperation({ summary: 'Assign a role to a user' })
  @ApiResponse({ status: 201, description: 'Role successfully assigned.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin only.' })
  async assignRoleToUser(@Body() body: AssignRoleDto) {
    return this.roleService.assignRoleToUser(body);
  }
}
