import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'secret_key', // Đổi key này trong thực tế
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    JwtAuthGuard,
    GoogleStrategy,
    FacebookStrategy,
    ConfigModule,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
