import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
  UseInterceptors,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserRole } from '../entities/user.entity';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateProfileDto,
  UpdateStatusDto,
  UserResponseDto,
} from '../dto/user.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorator/auth-user.decorator';
import { UserPayload } from 'src/auth/interfaces/jwt-payload.interface';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createForAdmin(
    @Body(new ValidationPipe({ whitelist: true })) createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const newUser = await this.userService.create(createUserDto);
    return new UserResponseDto(newUser);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllUser(): Promise<UserResponseDto[]> {
    const users = await this.userService.findAll();
    return users.map((user) => new UserResponseDto(user));
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request): Promise<UserResponseDto> {
    const { id: userId } = req.user as { id: string };
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin người dùng.');
    }
    return new UserResponseDto(user);
  }

  @Get(':id/name')
  @UseGuards(JwtAuthGuard)
  async getUsernameById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ username: string }> {
    return this.userService.getUserNameById(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<UserResponseDto> {
    if (req.user.role !== UserRole.ADMIN && req.user.userId !== id) {
      throw new ForbiddenException(
        'Bạn không có quyền xem thông tin người dùng này.',
      );
    }
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID "${id}"`);
    }
    return new UserResponseDto(user);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(
    @AuthUser() user: UserPayload,
    @Body(new ValidationPipe({ whitelist: true }))
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const userId = user.id;
    const updatedUser = await this.userService.update(userId, updateProfileDto);
    return new UserResponseDto(updatedUser);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @AuthUser() user: UserPayload,
    @Body()
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { oldPassword, newPassword } = changePasswordDto;
    await this.userService.changePassword(user.id, oldPassword, newPassword);
    return { message: 'Đổi mật khẩu thành công.' };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateStatus(id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true }))
    updateUserDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return new UserResponseDto(updatedUser);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.userService.remove(id);
  }
}
