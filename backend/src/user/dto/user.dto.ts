import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UserResponseDto {
  id: string;
  username: string;

  @Exclude()
  password: string;
  email: string;
  phone: string | null;

  @IsOptional()
  address: string | null;
  role: UserRole;

  @Exclude()
  refreshToken?: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
