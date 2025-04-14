import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from 'src/user/entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { IOAuthUser } from 'src/user/entities/oauth-user.interface';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private async generateTokens(user: User) {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    const hashedRefreshToken = await this.hashPassword(refresh_token);

    await this.userRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    return { access_token, refresh_token };
  }

  async register(registerDto: RegisterDto) {
    const { username, email, password, phone, address, role } = registerDto;

    await this.isUserExist({ username, email, phone });

    const hashedPassword = await this.hashPassword(password);
    const user = this.userRepository.create({
      username,
      email,
      phone,
      password: hashedPassword,
      address: address ?? '',
      role: role ?? UserRole.USER,
    });

    await this.userRepository.save(user);
    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: [{ username }],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await this.comparePasswords(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return this.generateTokens(user);
  }

  async validateOAuthUser(oAuthUser: IOAuthUser) {
    let user = await this.userRepository.findOne({
      where: { email: oAuthUser.email },
    });

    if (!user) {
      user = this.userRepository.create({
        email: oAuthUser.email,
        username: oAuthUser.username || oAuthUser.email.split('@')[0],
        role: UserRole.USER,
      });
      await this.userRepository.save(user);
    }
    return this.generateTokens(user);
  }

  async refreshToken(token: string) {
    if (!token) throw new UnauthorizedException('Refresh token is required');

    try {
      const decoded: JwtPayload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      if (!decoded?.userId)
        throw new UnauthorizedException('Invalid refresh token');

      const user = await this.userRepository.findOne({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        where: { id: decoded.userId },
      });

      if (
        !user ||
        !user.refreshToken ||
        !(await this.comparePasswords(token, user.refreshToken))
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedException({
        message: 'Invalid refresh token',
        cause: err instanceof Error ? err.message : String(err),
      });
    }
  }

  private async isUserExist({
    username,
    email,
    phone,
  }: Partial<User>): Promise<void> {
    const existingUsername = username
      ? await this.userRepository.findOne({ where: { username } })
      : null;

    if (existingUsername) {
      throw new ConflictException('Username already existed');
    }

    const existingEmail = email
      ? await this.userRepository.findOne({ where: { email } })
      : null;

    if (existingEmail) {
      throw new ConflictException('Email already existed');
    }

    const existingPhone = phone
      ? await this.userRepository.findOne({ where: { phone } })
      : null;

    if (existingPhone) {
      throw new ConflictException('Phone already existed');
    }
  }
}
