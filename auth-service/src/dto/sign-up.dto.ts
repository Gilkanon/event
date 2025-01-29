import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class SignUpDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 32)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 32)
  confirmPassword: string;
}
