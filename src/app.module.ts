import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from 'src/configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { LecturesController } from './lectures/lectures.controller';
import { LecturesModule } from './lectures/lectures.module';
import { BannerController } from './banner/banner.controller';
import { BannerModule } from './banner/banner.module';

@Module({
  imports: [
    CommonModule,
    UsersModule,
    TypeOrmModule.forRoot(typeORMConfig),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_SECRET: Joi.string().required(),
      }),
    }),
    AuthModule,
    LecturesModule,
    BannerModule,
  ],
  controllers: [AppController, BannerController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
