import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto, UpdateProfileDto, UpdateStatusDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
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

    const hashedPassword: string = await bcrypt.hash(
      createUserDto.password,
      10,
    );
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || UserRole.USER,
      isActive: createUserDto.isActive ?? true,
    });

    try {
      await this.userRepository.save(newUser);
      return sanitizeUser(newUser);
    } catch (error: any) {
      if ((error as { code?: string }).code === '23505') {
        console.error('Error saving user:', error);

        throw new ConflictException('Email hoặc Username đã tồn tại.');
      }
      console.error('Error saving user:', error);
      throw new InternalServerErrorException('Không thể tạo người dùng.');
    }
  }

  async findAll(): Promise<Omit<User, 'password' | 'refreshToken'>[]> {
    return this.userRepository.find({
      select: [
        'id',
        'accountName',
        'email',
        'username',
        'phone',
        'address',
        'role',
        'isActive',
      ],
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
    updateProfileDto: UpdateProfileDto,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID "${id}"`);
    }

    const updatePayload = Object.fromEntries(
      Object.entries(updateProfileDto).filter(
        ([, value]) => value !== undefined,
      ),
    );

    if (Object.keys(updatePayload).length === 0) {
      throw new Error('Không có dữ liệu để cập nhật.');
    }

    await this.userRepository.update(id, updatePayload);
    const updatedProfile = await this.findOneById(id);
    if (!updatedProfile) {
      throw new NotFoundException(
        `Không tìm thấy người dùng với ID "${id}" sau khi cập nhật.`,
      );
    }
    return sanitizeUser(updatedProfile);
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

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng.');
    }

    const isMatch: boolean = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new ConflictException('Mật khẩu cũ không đúng.');
    }

    const hashedPassword: string = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });
  }

  async updateStatus(
    id: string,
    dto: UpdateStatusDto,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID "${id}"`);
    }

    user.isActive = dto.isActive;
    await this.userRepository.save(user);

    return sanitizeUser(user);
  }
}

function sanitizeUser(user: User): Omit<User, 'password' | 'refreshToken'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, refreshToken, ...safeUser } = user;
  return safeUser;
}
