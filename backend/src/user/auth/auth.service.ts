import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './dto/auth.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(authDto: AuthDto) {
    const { username, email, password, phone, address, role } = authDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      role: role || 'user',
    });

    await this.userRepository.save(user);
    return { message: 'User registered successfully' };
  }

  async login(authDto: AuthDto) {
    const { username, email, password } = authDto;

    const user = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address,
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.userRepository.update(user.id, { refreshToken: refresh_token });

    return { access_token, refresh_token };
  }

  // Xử lý Google & Facebook OAuth (Nhận user từ Google/Facebook)
  async validateOAuthUser(oAuthUser: any) {
    return this.generateTokens(oAuthUser);
  }

  // Tạo Access Token & Refresh Token
  private async generateTokens(user: User) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Lưu refresh token vào DB
    await this.userRepository.update(user.id, { refreshToken: refresh_token });

    return { access_token, refresh_token };
  }

  // Xử lý Refresh Token
  async refreshToken(token: string) {
    if (!token) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const decoded: any = this.jwtService.verify(token);

      if (!decoded?.id) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.userRepository.findOne({
        where: { id: decoded.id },
      });

      if (!user || user.refreshToken !== token) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
        { expiresIn: '15m' },
      );

      return { access_token: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getAllUsers() {
    return this.userRepository.find({
      select: ['id', 'username', 'email', 'role', 'phone', 'address'],
    });
  }
}
