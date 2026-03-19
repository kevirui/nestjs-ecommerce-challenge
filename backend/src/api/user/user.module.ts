import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRegisteredListener } from './listeners/user-registered.listener';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => RoleModule)],
  controllers: [UserController],
  providers: [UserService, UserRegisteredListener],
  exports: [UserService],
})
export class UserModule {}
