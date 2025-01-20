import { Exclude } from 'class-transformer';

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export class UserEntity {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  id: number;

  name: string;

  email: string;

  @Exclude()
  password: string;

  @Exclude()
  role: Role;

  createdAt: Date;

  updatedAt: Date;
}
