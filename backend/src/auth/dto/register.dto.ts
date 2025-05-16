import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  Matches,
} from 'class-validator';
import { UserRole } from 'src/user/entities/user.entity';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{9,15}$/, {
    message: 'Phone number must be 9–15 digits',
  })
  phone: string;

  @IsOptional()
  address?: string | null;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
