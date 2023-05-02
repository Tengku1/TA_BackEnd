import { HttpException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
const fs = require('fs');
const crypto = require('crypto');
import _ from "lodash";
import { CreateHotelLocationsDto } from '../dto/create-hotel-locations.dto';
import { HotelLocationsEntity } from '../entities/locations.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { PutHotelLocationsDto } from '../dto/put-hotel-locations.dto';
import path from 'path';
import { GetBookingListsQuery } from '../dto/get-booking-lists-query.dto';
import { HotelBookingsEntity } from '../entities/bookings.entity';
import { GetHotelLocationsQuery } from '../dto/get-hotel-locations-query.dto';
import { SetHotelConfigurationsDto } from '../dto/set-hotel-configurations.dto';
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

  async setFeePerHotels(payload: SetHotelConfigurationsDto) {
    try {
      const results = await this.hotelConfigurationsRepository.find();
      const item = plainToInstance(HotelConfigurationsEntity, instanceToPlain(payload));

      if (results.length != 0) {
        const response = await this.hotelConfigurationsRepository.update(results[results.length -1 ].id , item);
        if (response.affected != 1) {
          throw new HttpException("Update Failed", 204);
        }

        return payload.percentage_fee;
      } else {
        const response = await this.hotelConfigurationsRepository.save(item);
        
        return response.percentage_fee;
      }
      
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async getFeePerHotels() {
    try {
      const results = await this.hotelConfigurationsRepository.find({
        select: ["percentage_fee"]
      });

      return results[results.length -1];
    } catch (error) {
      this.exceptionHandler(error);
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

  async getHotelLocations(query: GetHotelLocationsQuery) {
    try {
      // Cek keyword kosong atau tidak
      let results = {
        data: {},
        meta: {}
      };
      results.data = await this.hotelLocationRepository.find({
        take: query.limit,
        skip: (query.page - 1) * query.limit
      });
      if (query.q) {
        results.data = await this.hotelLocationRepository.find({
          where: `"name" ILIKE '%${query.q}%' or "country" ILIKE '%${query.q}%'  or "province" ILIKE '%${query.q}%'  or "area" ILIKE '%${query.q}%'  or "unit" ILIKE '%${query.q}%'`,
          take: query.limit,
          skip: (query.page - 1) * query.limit
        });
      }
      results.meta = {
        "itemKey": "id",
        "totalItems": Object.keys(results.data).length
      }

      return results;
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async getHotelLocationsByID(id: number) {
    try {
      // Cek keyword kosong atau tidak
      let results = {
        data: {},
        meta: {}
      };
      results.data = await this.hotelLocationRepository.find({
        where: `"id" = ${id}`
      });

      results.meta = {
        "itemKey": "id"
      }

      return results;
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async createLocations(payload: CreateHotelLocationsDto) {
    try {
      const item = plainToInstance(HotelLocationsEntity, instanceToPlain(payload));
      const response = await this.hotelLocationRepository.save(item);
      return response;
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async createBulkLocations() {
    try {
      await this.hotelLocationRepository.query(`TRUNCATE hotel_locations RESTART IDENTITY CASCADE;`)
      const rawData = fs.readFileSync(path.join(__dirname, '../../../../views/hotel-dummy-data/id-locations.json'));
      const locations = JSON.parse(rawData);
      const locations_parsed = locations.map((location) => ({
        name: location.city,
        country: 'Indonesia',
        province: location.admin_name,
        latitude: location.lat,
        longitude: location.lng,
        area: null,
        unit: null,
        is_popular: location.isPopular,
        image: location.image
      }));
      const item = plainToInstance(HotelLocationsEntity, instanceToPlain(locations_parsed));
      await this.hotelLocationRepository.save(item, {chunk:100});
      return true;
    } catch (err) {
      this.exceptionHandler(err);
    }
  }

  async updateLocations(id: number, payload: PutHotelLocationsDto) {
    try {
      const item = plainToInstance(HotelLocationsEntity, instanceToPlain(payload));
      await this.hotelLocationRepository.update(id, item);
      return item;
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async deleteLocation(id: number) {
    try {
      const location = await this.hotelLocationRepository.findOne(id);
      if (!location) {
        throw new HttpException("Location Not Found", 400);
      }

      await this.hotelLocationRepository.delete(id);
      return true;
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
