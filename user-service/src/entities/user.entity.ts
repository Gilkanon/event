import { Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  id: number;

  name: string | null;

  email: string;

  @Exclude()
  password: string;

  @Exclude()
  role: Role;

  createdAt: Date;

  updatedAt: Date;
}
