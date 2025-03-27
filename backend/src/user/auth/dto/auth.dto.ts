import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsString,
  IsEnum,
} from 'class-validator';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export class AuthDto {
  @IsOptional()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Vai trò không hợp lệ' })
  role?: UserRole;
}
