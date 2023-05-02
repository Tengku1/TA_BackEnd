import { HttpException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
const crypto = require('crypto');
import { GetCheckRatesHotelsDto } from './dto/get-checkrates-hotels.dto';
import { CreateHotelsBookingDto } from './dto/create-hotels-booking.dto';
import { HotelLocationsEntity } from './entities/locations.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAvailabilityBookingDto } from './dto/get-availability-booking-dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { HotelBookingsEntity } from './entities/bookings.entity';
import { GetHotelLocationsQuery } from './dto/get-hotel-locations-query.dto';
import { PutHotelsBookingDto } from './dto/put-hotels-booking-dto';
import { HotelBookHotelEntity } from './entities/book_hotel.entity';
import { GetAvailabilityByHotelDto } from './dto/get-availability-book-by-hotel.dto';
import { GetRateCommentDetailQuery } from './dto/get-rate-comment-detail-query.dto';
import { GetHotelByNameDto } from './dto/get-hotel-by-name.dto';
import HotelbedsLanguage from './enum/hotelbeds-language.enum';
import { HotelConfigurationsEntity } from './entities/hotel_config.entity';
import { HotelEntity } from './entities/hotel.entity';
import { PaginationQuery } from './dto/pagination.query.dto';


@Injectable()
export class HotelService {
  baseUrl: string;
  apiKey: string;
  secretKey: string;
  contentApiPath: string;
  apiPath: string;
  contentTypesPath: string;
  geolocationRadius: string;
  geolocationUnit: string;
  hotelsListLimit: string;

  constructor(
    @InjectRepository(HotelLocationsEntity)
    private readonly hotelLocationRepository: Repository<HotelLocationsEntity>,
    @InjectRepository(HotelBookingsEntity)
    private readonly hotelBookingRepository: Repository<HotelBookingsEntity>,
    @InjectRepository(HotelBookHotelEntity)
    private readonly hotelBookHotelRepository: Repository<HotelBookHotelEntity>,
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
    this.apiKey = this.configService.get('HOTELS_API_KEY');
    this.secretKey = this.configService.get('HOTELS_SECRET_KEY');
    this.apiPath = this.configService.get('HOTELS_API_PATH');
    this.contentApiPath = this.configService.get('HOTELS_CONTENT_API_PATH');
    this.contentTypesPath = this.configService.get('HOTELS_CONTENT_TYPES_API_PATH');
    this.geolocationRadius = this.configService.get('HOTELS_GEOLOCATION_RADIUS');
    this.geolocationUnit = this.configService.get('HOTELS_GEOLOCATION_UNIT');
    this.hotelsListLimit = this.configService.get('HOTELS_LIST_LIMIT');
    this.httpService.axiosRef.defaults.timeout = 10000;
  }

  exceptionHandler(error) {
    Logger.error(JSON.stringify(error));

    if (error.response) {
      if (error.response.data) {
        if (error.response.data?.error?.message) {
          if (error.response.data?.error?.message)
            throw new HttpException(error.response.data?.error?.message, error.response.status);
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

  async checkStatusApi() {
    try {
      const response = await this.httpService.axiosRef.get('/status', {
        baseURL: `${this.baseUrl}${this.apiPath}`,
        headers: this.header()
      });
      return response.data;
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async getHotelByName(payload: GetHotelByNameDto, query: PaginationQuery) {
    try {
      const data = await this.hotelRepository.find({
        where: `"name" ILIKE '%${payload.name}%'`,
        take: query.limit,
        skip: (query.page - 1) * query.limit
      });
      
      return {
        totalData: data.length,
        data
      };
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async getHotelDetail(id: string) {
    try {
      const response = await this.httpService.axiosRef.get(`/hotels/${id}/details`, {
        baseURL: `${this.baseUrl}${this.contentApiPath}`,
        headers: this.header()
      });

      return response.data;
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async getHotelLocations(query: GetHotelLocationsQuery) {
    try {
      let results = {
        data: {},
        meta: {}
      };
      results.data = await this.hotelLocationRepository.find({
        take: query.limit,
        skip: (query.page - 1) * query.limit
      });
      
      // Cek keyword kosong atau tidak
      if (query.q) {
        results.data = await this.hotelLocationRepository.find({
          where: `"name" ILIKE '%${query.q}%' or "country" ILIKE '%${query.q}%'  or "province" ILIKE '%${query.q}%'  or "area" ILIKE '%${query.q}%'  or "unit" ILIKE '%${query.q}%'`,
          take: query.limit,
          skip: (query.page - 1) * query.limit
        });
      }
      if (!query.q && query.isPopular) {
        results.data = await this.hotelLocationRepository.find({
          where: `is_popular = ${query.isPopular}`,
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

  async rateCommentDetail(query: GetRateCommentDetailQuery) {
    try {
      const date = new Date();
      const response = await this.httpService.axiosRef.get(`/ratecommentdetails?code=${query.code}&date=${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`, {
        baseURL: `${this.baseUrl}${this.contentTypesPath}`,
        headers: this.header()
      });
      return response.data;
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async checkRates(payload: GetCheckRatesHotelsDto) {
    try {
      const response = await this.httpService.axiosRef.request({
        baseURL: `${this.baseUrl}${this.apiPath}`,
        headers: this.header(),
        method: 'POST',
        data: {
          rooms: [
            payload
          ],
          language: payload.language
        },
        url: `/checkrates`
      });
      return response.data;
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async booking(payload: CreateHotelsBookingDto) {
    try {
      this.httpService.axiosRef.defaults.timeout = 60000;
      const response = await this.httpService.axiosRef.request({
        baseURL: `${this.baseUrl}/hotel-api/1.2`,
        headers: this.header(),
        method: 'POST',
        data: payload,
        url: '/bookings'
      });

      const book = response.data.booking;
      if (book.hotel.currency !== "IDR") {
        book.hotel.total_net = await this.toIDR(book.hotel.currency, book.hotel.total_net);
        book.pending_amount = await this.toIDR(book.hotel.currency, book.pending_amount);
        payload.xplorin_selling_rate = parseInt(await this.toIDR(book.hotel.currency, payload.xplorin_selling_rate));
      }

      let hotelDetail = await this.httpService.axiosRef.get(`/hotels/${book.hotel.code}/details`, {
        baseURL: `${this.baseUrl}${this.contentApiPath}`,
        headers: this.header()
      });
      let hotelDetailData = hotelDetail.data.hotel;

      hotelDetailData.rooms = hotelDetailData.rooms.filter((room) => room.roomCode == book.hotel.rooms[0].code);

      const facilities = hotelDetailData.facilities;
      for (let i=0; i < facilities.length; i++) {
        if (facilities[i].facilityCode == 260 && facilities[i].facilityGroupCode == 70) {
          hotelDetailData.check_in = facilities[i].timeFrom;
          delete hotelDetailData.facilities[i];
          continue;
        }
        if (facilities[i].facilityCode == 390 && facilities[i].facilityGroupCode == 70) {
          hotelDetailData.check_out = facilities[i].timeTo;
          delete hotelDetailData.facilities[i];
        }
      }

      const hotel_room = book.hotel.rooms[0];
      let hotel_guest_detail;
      let childText = hotel_room.rates[0].children != 1 ? "Children" : "Child";

      const hotel_room_total_adult = hotel_room.rates[0].adults * payload.total_room;
      if (hotel_room.rates[0].children > 0) {
        const hotel_room_total_child = hotel_room.rates[0].children * payload.total_room;
        hotel_guest_detail = `${hotel_room_total_adult} Adult, ${hotel_room_total_child} ${childText} (`;

        let child_age = "";
        hotel_room.paxes.forEach((item) => {
            if(item['type'] === "CH") {
                child_age += `${item.age} years old,`;
            }
        });
        
        child_age = `${child_age.slice(0,-1)}`;
        hotel_guest_detail += `${child_age})`;
      } else {
        hotel_guest_detail = `${hotel_room_total_adult} Adult(s)`;
      }
      
      const data = [
        {
          booking_reference_code: book.reference,
          user: 123,
          phone: payload.phone,
          email: payload.email,
          clientReference: book.clientReference,
          status: "PENDING",
          holder_name: book.holder.name,
          holder_surname: book.holder.surname,
          hotel: book.hotel.code,
          check_in_time: hotelDetailData.check_in,
          check_out_time: hotelDetailData.check_out || "23.00:00",
          total_net: payload.xplorin_selling_rate,
          currency: book.hotel.currency,
          fee: payload.fee,
          hotel_mandatroy: payload.hotel_mandatory_rate,
          payment_status: "PENDING",
          pending_amount: payload.xplorin_selling_rate,
          totalGuest: payload.rooms[0].paxes.length,
          guests: hotel_guest_detail,
          total_room: payload.total_room,
          roomType: book.hotel.rooms[0].name,
          supplier_name: book.hotel.supplier.name,
          supplier_vatNumber: book.hotel.supplier.vatNumber,
          remark: payload.remark,
          image: `http://photos.hotelbeds.com/giata/bigger/${payload.image}`,
          net: book.hotel.totalNet
        },
        {
          code: book.hotel.code,
          check_in: book.hotel.checkIn,
          check_out: book.hotel.checkOut,
          name: book.hotel.name,
          category_code: book.hotel.categoryCode,
          category_name: book.hotel.categoryName,
          destination_code: book.hotel.destinationCode,
          destination_name: book.hotel.destinationName,
          zone_code: book.hotel.zoneCode,
          zone_name: book.hotel.zoneName,
          latitude: book.hotel.latitude,
          longitude: book.hotel.longitude,
          rooms: book.hotel.rooms
        },
        {
          hotel_detail: hotelDetailData
        }
      ];

      const tbl_book = plainToInstance(HotelBookingsEntity, instanceToPlain(data[0]));
      const tbl_book_hotel = plainToInstance(HotelBookHotelEntity, instanceToPlain(data[1]));

      await this.hotelBookHotelRepository.save(tbl_book_hotel);
      await this.hotelBookingRepository.save(tbl_book);
      return {
        ...data[0],
        ...data[1],
        ...data[2]
      };
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async bookingDetail(rfCode: string, language?: HotelbedsLanguage) {
    try {
      const response = await this.httpService.axiosRef.get(`/bookings/${rfCode}?language=${language}`, {
        baseURL: `${this.baseUrl}${this.apiPath}`,
        headers: this.header()
      });
      return response.data;
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async putBooking(id: string, payload: PutHotelsBookingDto) {
    try {
      const response = await this.httpService.axiosRef.request({
        baseURL: `${this.baseUrl}${this.apiPath}`,
        headers: this.header(),
        method: 'PUT',
        data: payload,
        url: `/bookings/${id}`
      });

      return response.data;
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async checkBookingAvailability(payload: GetAvailabilityBookingDto) {
    try {
      const res = await this.httpService.axiosRef.request({
        baseURL: `${this.baseUrl}${this.apiPath}`,
        headers: this.header(),
        method: 'POST',
        data: {
          ...payload,
          geolocation: {
            ...payload.geolocation,
            radius: this.geolocationRadius,
            unit: this.geolocationUnit
          }
        },
        url: `/hotels`
      });

      let hotelList = res.data.hotels.hotels;
      if (hotelList == undefined) {
        return [];
      }
      if (payload.offset != null) {
        const offsetData = this.limitPaginationData(payload.offset, this.hotelsListLimit);
        hotelList = hotelList.slice(offsetData.startIndex, offsetData.lastIndex + 1);
      }

      const codes = [];
      hotelList.forEach((element) => {
        codes.push(element.code);
      });

      const hotelDetail = await this.httpService.axiosRef.request({
        baseURL: `${this.baseUrl}${this.contentApiPath}`,
        headers: this.header(),
        method: 'GET',
        url: `/hotels?fields=images,address&codes=${codes}`
      });

      const hotels = {};
      hotelDetail.data.hotels.forEach((element) => {
        hotels[element.code] = element;
      });

      return hotelList.map((element) => ({
        ...element,
        ...hotels[element.code]
      }));
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async checkBookingAvailabilityByHotelCode(payload: GetAvailabilityByHotelDto) {
    try {
      const res = await this.httpService.axiosRef.request({
        baseURL: `${this.baseUrl}${this.apiPath}`,
        headers: this.header(),
        method: 'POST',
        data: {
          ...payload,
          reviews: [
            {
              type: 'TRIPADVISOR',
              maxRate: 5,
              minRate: 1
            }
          ]
        },
        url: `/hotels`
      });

      let hotelList = res.data.hotels.hotels;
      if (hotelList == undefined) {
        return [];
      }
      if (payload.offset != null) {
        const offsetData = this.limitPaginationData(payload.offset, this.hotelsListLimit);
        hotelList = hotelList.slice(offsetData.startIndex, offsetData.lastIndex + 1);
      }

      const codes = [];
      hotelList.forEach((element) => {
        codes.push(element.code);
      });

      const hotelDetail = await this.httpService.axiosRef.request({
        baseURL: `${this.baseUrl}${this.contentApiPath}`,
        headers: this.header(),
        method: 'GET',
        url: `/hotels?fields=images,address&codes=${codes}`
      });

      const hotels = {};
      hotelDetail.data.hotels.forEach((element) => {
        hotels[element.code] = element;
      });

      return hotelList.map((element) => ({
        ...element,
        ...hotels[element.code]
      }));
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async cancelBooking(rfCode: string, language?: HotelbedsLanguage) {
    try {
      const response = await this.httpService.axiosRef.delete(`/bookings/${rfCode}?cancellationFlag=CANCELLATION&language=${language}`, {
        baseURL: `${this.baseUrl}${this.apiPath}`,
        headers: this.header()
      });

      const checkPaymentStatus = await this.hotelBookingRepository.find({
        where: `"booking_reference_code" = '${rfCode}'`,
        select: ['payment_status']
      });

      if (checkPaymentStatus[0].payment_status == "PAID") {
        throw new HttpException("Payment Status cannot be 'PAID'", 400);
      }

      await this.hotelBookingRepository.update({
        booking_reference_code: rfCode
      }, {
        status: "CANCELLED",
        payment_status: "CANCELLED"
      });

      return response.data;
    } catch (err) {
      this.exceptionHandler(err);
    }
  };
  
  async reconfirmationBook() {
    try {
      const response = await this.httpService.axiosRef.get(`/bookings/reconfirmations`, {
        baseURL: `${this.baseUrl}${this.apiPath}`,
        headers: this.header()
      });
      return response.data;
    } catch (err) {
      this.exceptionHandler(err);
    }
  };

  async getFeePerHotels() {
    try {
      const results = await this.hotelConfigurationsRepository.find({
        select: ["percentage_fee"]
      });
      
      return results[0];
    } catch (error) {
      this.exceptionHandler(error);
    }
  }

  limitPaginationData(offset, limit) {
    const startIndex = offset * limit;
    const lastIndex = ((offset + 1) * limit) - 1;
    return {
      startIndex,
      lastIndex
    };
  };

  async toIDR(currency: string, amount: number) {
    try {
        const response = await this.httpService.axiosRef.get(`convert?from=${currency}&to=IDR`, {
            baseURL: 'https://api.exchangerate.host'
        });
        const rate = Number(response.data.info.rate) + 100; // tambah 100 perak untuk menghandle kekurangan dari desimal
        return Math.round(amount * rate).toString();
    } catch (error) {
        throw new HttpException(error.message, error.status);
    }
  }
}
