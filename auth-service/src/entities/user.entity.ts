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

  password: string;

  role: Role;

  createdAt: Date;

  updatedAt: Date;
}
