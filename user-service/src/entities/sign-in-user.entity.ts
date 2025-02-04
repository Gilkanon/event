import { Role, User } from '@prisma/client';

export class SignInUserEntity implements User {
  constructor(partial: Partial<SignInUserEntity>) {
    Object.assign(this, partial);
  }

  id: number;

  name: string | null;

  email: string;

  password: string;

  role: Role;

  createdAt: Date;

  updatedAt: Date;
}
