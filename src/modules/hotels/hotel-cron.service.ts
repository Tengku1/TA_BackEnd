import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HotelEntity } from './entities/hotel.entity';
import { HotelAdminService } from './admin/hotels.admin.service';

@Injectable()
export class HotelCronService {
    constructor(
        @InjectRepository(HotelEntity)
        private readonly hotelRepository: Repository<HotelEntity>,
        private readonly adminHotelService: HotelAdminService
    ) { }

    @Cron(CronExpression.EVERY_WEEKEND)
    async clearHotel() {
        await this.hotelRepository.clear();
        await this.adminHotelService.importHotels();
    }
}