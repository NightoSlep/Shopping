import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModuleOptions } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './user/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '9096441332',
      database: 'shopping',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModuleOptions,
    ConfigModule.forRoot({
      isGlobal: true, // Đảm bảo ConfigModule có thể được sử dụng ở mọi module
    }),
    AuthModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
