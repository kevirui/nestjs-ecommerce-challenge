import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from '../../auth/events/user-registered.event';
import { RoleService } from '../../role/services/role.service';
import { UserService } from '../services/user.service';
import { RoleIds } from '../../role/enum/role.enum';

@Injectable()
export class UserRegisteredListener {
  constructor(
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @OnEvent('user.registered')
  async handleUserRegisteredEvent(event: UserRegisteredEvent) {
    const { user } = event;
    const customerRole = await this.roleService.findById(RoleIds.Customer);

    // Assign role to user
    user.roles = [customerRole];
    await this.userService.save(user);

    console.log(
      `[Event] User ${user.email} registered. Role 'Customer' assigned.`,
    );
  }
}
