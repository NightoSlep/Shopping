import { IsEmail, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from 'src/user/entities/user.entity';

export class RegisterDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  phone?: string | null;

  @IsOptional()
  address?: string | null;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
