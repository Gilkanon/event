enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export class UserEntity {
  id: number;
  email: string;
  password: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
}
