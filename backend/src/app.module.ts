import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModuleOptions } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CloudinaryModule } from './common/providers/cloudinary/cloudinary.module';
import { CloudinaryProvider } from './common/providers/cloudinary/cloudinary.provider';
import { BannerModule } from './banner/banner.module';
import { OrderModule } from './orders/order.module';
import { OrderDetailModule } from './order-details/order-detail.module';

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
      isGlobal: true,
    }),
    AuthModule,
    CategoryModule,
    ConfigModule,
    UserModule,
    ProductModule,
    CloudinaryModule,
    BannerModule,
    OrderModule,
    OrderDetailModule,
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryProvider],
})
export class AppModule {}
