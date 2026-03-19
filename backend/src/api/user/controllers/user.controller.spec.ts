import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from 'src/config';
import { TypeOrmConfigService } from 'src/database/typeorm/typeorm.service';
import { AuthModule } from '../../auth/auth.module';
import { UserController } from './user.controller';
import { User } from '../../../database/entities/user.entity';
import { UserService } from '../services/user.service';

import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

describe('UserController', () => {
  let controller: UserController;
  let fakeUserService: Partial<UserService>;
  beforeEach(async () => {
    fakeUserService = {
      createUser: () => {
        return Promise.resolve({
          id: 1,
          email: 'testuser@example.com',
          password: 'password',
        } as User);
      },
      findById: (id: number) => {
        return Promise.resolve({
          id,
          email: 'testuser@example.com',
          password: 'password',
        } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should return profile', async () => {
    const user = { id: 1 } as User;
    const result = await controller.profile(user);
    expect(result).toEqual({
      id: 1,
      email: 'testuser@example.com',
      password: 'password',
    });
  });
});
