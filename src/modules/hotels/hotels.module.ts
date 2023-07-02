import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '../http/http.module';
import * as redisStore from 'cache-manager-redis-store';
import { HotelsController } from './hotels.controller';
import { HotelService } from './hotels.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelBookingsEntity } from './entities/bookings.entity';
import { HotelBookHotelEntity } from './entities/book_hotel.entity';
import { HotelConfigurationsEntity } from './entities/hotel_config.entity';
import { HotelUsersEntity } from './entities/hotel_users.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            HotelBookingsEntity,
            HotelBookHotelEntity,
            HotelConfigurationsEntity,
            HotelUsersEntity
        ]),
        PassportModule.register({ defaultStrategy: 'firebase' }),
        HttpModule,
        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                ttl: 3600,
                store: redisStore,
                host: configService.get('REDIS_HOST'),
                port: configService.get('REDIS_PORT'),
                auth_pass: configService.get('REDIS_AUTH')
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [HotelsController],
    providers: [ConfigService, HotelService],
    exports: [
        HotelService,
    ],
})
export class HotelsModule { }