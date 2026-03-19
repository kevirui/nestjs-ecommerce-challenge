import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/api/auth/guards/auth.decorator';
import { CurrentUser } from 'src/api/auth/guards/user.decorator';
import { Serialize } from 'src/common/helper/serialize.interceptor';
import { User } from 'src/database/entities/user.entity';
import { UserDto } from '../dto/user.dto';
import { UserService } from '../services/user.service';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Serialize(UserDto)
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  profile(@CurrentUser() user: User) {
    return this.userService.findById(user.id);
  }
}
