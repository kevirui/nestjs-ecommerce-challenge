import { User } from 'src/database/entities/user.entity';

export class UserRegisteredEvent {
  constructor(public readonly user: User) {}
}
