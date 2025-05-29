import { ConfigService } from '@nestjs/config';
import * as cloudinary from 'cloudinary';

const cloudinaryV2 = cloudinary.v2;

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: (configService: ConfigService): typeof cloudinaryV2 => {
    cloudinaryV2.config({
      cloud_name: configService.get<string>('CLOUDINARY_NAME') || '',
      api_key: configService.get<string>('CLOUDINARY_API_KEY') || '',
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET') || '',
    });
    return cloudinaryV2;
  },
  inject: [ConfigService],
};
