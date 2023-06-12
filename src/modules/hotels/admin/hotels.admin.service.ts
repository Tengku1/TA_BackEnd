import { HttpException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
const fs = require('fs');
const crypto = require('crypto');
import _ from "lodash";
import { HotelLocationsEntity } from '../entities/locations.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { GetBookingListsQuery } from '../dto/get-booking-lists-query.dto';
import { HotelBookingsEntity } from '../entities/bookings.entity';
import { HotelConfigurationsEntity } from '../entities/hotel_config.entity';
import moment from 'moment';
import { HotelEntity } from '../entities/hotel.entity';
import { PaginationQuery } from '../dto/pagination.query.dto';


@Injectable()
export class HotelAdminService {
  baseUrl: string;
  apiKey: string;
  contentApiPath: string;
  apiPath: string;
  contentTypesPath: string;
  geolocationRadius: string;
  geolocationUnit: string;
  hotelsListLimit: string;
  secretKey: string;

  constructor(
    @InjectRepository(HotelLocationsEntity)
    private readonly hotelLocationRepository: Repository<HotelLocationsEntity>,
    @InjectRepository(HotelBookingsEntity)
    private readonly hotelBookingRepository: Repository<HotelBookingsEntity>,
    @InjectRepository(HotelConfigurationsEntity)
    private readonly hotelConfigurationsRepository: Repository<HotelConfigurationsEntity>,
    @InjectRepository(HotelEntity)
    private readonly hotelRepository: Repository<HotelEntity>,
    private configService: ConfigService,
    private httpService: HttpService
  ) {
    this.init();
  }

  init() {
      this.baseUrl = this.configService.get('HOTELS_BASE_URL');
      this.apiPath = this.configService.get('HOTELS_API_PATH');
      this.contentApiPath = this.configService.get('HOTELS_CONTENT_API_PATH');
      this.contentTypesPath = this.configService.get('HOTELS_CONTENT_TYPES_API_PATH');
      this.geolocationRadius = this.configService.get('HOTELS_GEOLOCATION_RADIUS');
      this.geolocationUnit = this.configService.get('HOTELS_GEOLOCATION_UNIT');
      this.hotelsListLimit = this.configService.get('HOTELS_LIST_LIMIT');
      this.secretKey = this.configService.get('HOTELS_SECRET_KEY');
      this.apiKey = this.configService.get('HOTELS_API_KEY');
      this.httpService.axiosRef.defaults.timeout = 10000;
  }

  exceptionHandler(error) {
    Logger.error(JSON.stringify(error));

    if (error.response) {
        if (error.response.data) {
            if (error.response.data.message) {
                if (error.response.data.message)
                    throw new HttpException(error.response.data.message, error.response.status);
                else
                    throw new HttpException(error.message, error.response.status);
            } else {
                throw new HttpException(error.message, error.response.status);
            }
        } else {
            throw new HttpException(error.message, error.status);
        }
    } else {
        throw error;
    }
  }

  get signature() {
    return crypto.createHash('sha256').update(`${this.apiKey}${this.secretKey}${Math.floor(new Date().getTime() / 1000)}`).digest('hex');
  }

  header() {
    return {
      'Accept': 'application/json',
      'Accept-encoding': 'gzip',
      'api-key': this.apiKey,
      'x-signature': this.signature
    }
  }

  async getAll(query: PaginationQuery) {
    try {
      // Cek keyword kosong atau tidak
      let results = {
        data: {},
        meta: {}
      };
      results.data = await this.hotelRepository.find({
        take: query.limit,
        skip: (query.page - 1) * query.limit
      });

      results.meta = {
        "itemKey": "id",
        "totalItems": Object.keys(results.data).length
      }

      return results;
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async getHotelDetail(id: string) {
    try {
      return await this.hotelRepository.findOne(id);
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async bookingList(query: GetBookingListsQuery) {
    try {
      let list = await this.hotelBookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.hotel','book_hotel.code');

      if (!query.status && !query.start) {
        list.getMany();
      } else if (query.status && !query.start) {
        list.where(`"status" = '${query.status}'`).getMany();
      } else if (!query.status && query.start) {
        if (!query.end) {
          list.where(`"created_at" = '${query.start}'`).getMany();
        } else {
          list.where(`"created_at" >= '${query.start}'`)
          .andWhere(`"created_at" <= '${query.end}'`)
          .getMany();
        }
      } else {
        list.where(`"status" = '${query.status}'`)
        .andWhere(`"created_at" >= '${query.start}'`)
        .andWhere(`"created_at" <= '${query.end}'`)
        .getMany();
      }

      let data = await list.take(query.limit).skip((query.page - 1) * query.limit).getMany();
      let totalFee: number = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].status == "CONFIRMED") {
          totalFee += parseInt(data[i].fee.toString());
        }
      }

      return {
        totalFee,
        data
      };
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async bookingDetail(rfCode: string) {
    try {
      const results = await this.hotelBookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.hotel','book_hotel.code')
      .where(`"booking_reference_code" = '${rfCode}'`)
      .getOne();

      return results;
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async getBooksReport() {
    try {
      const date = new Date();
      const current_date = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,'0')}-${date.getDate()}`;
      const firstDate = moment().startOf('month').format('YYYY-MM-DD');
      const lastDate = moment().endOf('month').format("YYYY-MM-DD");
      
      const day = await this.hotelBookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.hotel','book_hotel.code')
      .where(`"created_at" = '${current_date}'`).getCount();
      
      const dayPaid = await this.hotelBookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.hotel','book_hotel.code')
      .where(`"created_at" = '${current_date}' and "payment_status" = 'PAID'`).getCount();

      const monthPaid = await this.hotelBookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.hotel','book_hotel.code')
      .where(`"created_at" >= '${firstDate}' and "created_at" <= '${lastDate}' and "payment_status" = 'PAID'`).getCount();

      return {
        day,
        dayPaid,
        monthPaid
      };
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async importHotels() {
    try {
      await this.hotelRepository.clear();

      const response = await this.httpService.axiosRef.get(`/hotels?countryCode=ID&from=1&to=1`, {
        baseURL: `${this.baseUrl}${this.contentApiPath}`,
        headers: this.header()
      });

      let totalData = response.data.total;
      for (let i = 1; i <= totalData; i+=100) {
        let hotel;
        let hotelDetail;
        if (i + 100 > totalData) {
          hotel = await this.httpService.axiosRef.get(`/hotels?countryCode=ID&from=${i}&to=${totalData}`, {
            baseURL: `${this.baseUrl}${this.contentApiPath}`,
            headers: this.header()
          });
          i = totalData;
        } else {
          hotel = await this.httpService.axiosRef.get(`/hotels?countryCode=ID&from=${i}&to=${i+100}`, {
            baseURL: `${this.baseUrl}${this.contentApiPath}`,
            headers: this.header()
          });
        }

        for (let d = 0; d < hotel.data.hotels.length; d++) {
          hotelDetail = await this.httpService.axiosRef.get(`/hotels/${hotel.data.hotels[d].code}/details`, {
            baseURL: `${this.baseUrl}${this.contentApiPath}`,
            headers: this.header()
          });

          if (hotelDetail.data.hotel.facilities) {
            const facilities = hotelDetail.data.hotel.facilities;
            for (let j=0; j < facilities.length; j++) {
              if (facilities[j]) {
                if (facilities[j].facilityCode == 260 && facilities[j].facilityGroupCode == 70) {
                  hotelDetail.data.hotel.check_in = facilities[j].timeFrom;
                  delete hotelDetail.data.hotel.facilities[j];
                  continue;
                }
                if (facilities[j].facilityCode == 390 && facilities[j].facilityGroupCode == 70) {
                  hotelDetail.data.hotel.check_out = facilities[j].timeTo;
                  delete hotelDetail.data.hotel.facilities[j];
                }
              }
            }
          }

          if (hotelDetail.data.hotel.description) {
            hotelDetail.data.hotel.description = hotelDetail.data.hotel.description.content;
    
          }
          if (hotelDetail.data.hotel.name) {
            hotelDetail.data.hotel.name = hotelDetail.data.hotel.name.content;
          }
          if (hotelDetail.data.hotel.city) {
            hotelDetail.data.hotel.city = hotelDetail.data.hotel.city.content;
          }
          
          const item = plainToInstance(HotelEntity,instanceToPlain(hotelDetail.data.hotel));
          this.hotelRepository.save(item);
        }
      }

      return "Success";
    } catch (err) {
      this.exceptionHandler(err);
    }
  }
}
