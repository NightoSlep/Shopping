/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
// import { AuthModule } from '../auth/auth.module'; // Import nếu cần dùng trực tiếp Guards etc.

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // forwardRef(() => AuthModule), // Sử dụng nếu có circular dependency giữa UserModule và AuthModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Quan trọng: Export UserService để AuthModule có thể sử dụng
})
export class UserModule {}
