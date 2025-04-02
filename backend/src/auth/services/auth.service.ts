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
    const payload = { id: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Lưu refresh token vào DB (đã mã hóa)
    const hashedRefreshToken = await this.hashPassword(refresh_token);
    await this.userRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    return { access_token, refresh_token };
  }

  async register(registerDto: RegisterDto) {
    const { username, email, password, phone, address, role } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      phone: phone || '',
      address: address || '',
      role: role || UserRole.USER,
    });

    await this.userRepository.save(user);
    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: [{ email }],
    });

    if (!user || !(await this.comparePasswords(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  // Xử lý Google & Facebook OAuth (Nhận user từ Google/Facebook)
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

  // Xử lý Refresh Token
  async refreshToken(token: string) {
    if (!token) throw new UnauthorizedException('Refresh token is required');

    try {
      const decoded: JwtPayload = this.jwtService.verify(token);

      if (!decoded?.id)
        throw new UnauthorizedException('Invalid refresh token');

      const user = await this.userRepository.findOne({
        where: { id: String(decoded.id) },
      });

      if (
        !user ||
        !user.refreshToken ||
        !(await this.comparePasswords(token, user.refreshToken))
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
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
