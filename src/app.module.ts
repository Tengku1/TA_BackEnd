import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { I18nJsonParser, I18nModule, AcceptLanguageResolver } from 'nestjs-i18n';
import { PdfModule } from './modules/pdf/pdf.module';
import configuration from './configuration';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { HotelsModule } from './modules/hotels/hotels.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: __dirname + '/../modules/i18n/',
      },
      resolvers: [
        AcceptLanguageResolver
      ]
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_AUTH')
        }
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    PdfModule,
    HotelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
