import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    hashedPassword?: string,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException(
          `Email "${createUserDto.email}" đã tồn tại.`,
        );
      }
      if (existingUser.username === createUserDto.username) {
        throw new ConflictException(
          `Username "${createUserDto.username}" đã tồn tại.`,
        );
      }
    }

    if (!hashedPassword) {
      console.error(
        'Password hashing should be done before calling UserService.create',
      );
      throw new InternalServerErrorException('Lỗi xử lý nội bộ.');
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || UserRole.USER,
    });

    try {
      await this.userRepository.save(newUser);
      return sanitizeUser(newUser);
    } catch (error: any) {
      if ((error as { code?: string }).code === '23505') {
        throw new ConflictException('Email hoặc Username đã tồn tại.');
      }
      console.error('Error saving user:', error);
      throw new InternalServerErrorException('Không thể tạo người dùng.');
    }
  }

  async findAll(): Promise<Omit<User, 'password' | 'refreshToken'>[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'username', 'phone', 'address', 'role'],
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID "${id}"`);
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(
          `Username "${updateUserDto.username}" đã được sử dụng.`,
        );
      }
    }
    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.findOneById(id);
    if (!updatedUser) {
      throw new NotFoundException(
        `Không tìm thấy người dùng với ID "${id}" sau khi cập nhật.`,
      );
    }
    return sanitizeUser(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID "${id}"`);
    }
  }

  async updateRefreshToken(
    userId: string,
    refreshTokenHash?: string | null,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      refreshToken: refreshTokenHash ?? undefined,
    });
  }

  async getUserNameById(id: string): Promise<{ username: string }> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['username'],
    });
    if (!user) throw new NotFoundException('User not found');
    return { username: user.username };
  }
}

function sanitizeUser(user: User): Omit<User, 'password' | 'refreshToken'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, refreshToken, ...safeUser } = user;
  return safeUser;
}
