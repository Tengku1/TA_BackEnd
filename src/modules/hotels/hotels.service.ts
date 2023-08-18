import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
const crypto = require('crypto');
import { GetCheckRatesHotelsDto } from './dto/get-checkrates-hotels.dto';
import { CreateHotelsBookingDto } from './dto/create-hotels-booking.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAvailabilityBookingDto } from './dto/get-availability-booking-dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { HotelBookingsEntity } from './entities/bookings.entity';
import { HotelBookHotelEntity } from './entities/book_hotel.entity';
import { GetRateCommentDetailQuery } from './dto/get-rate-comment-detail-query.dto';
import HotelbedsLanguage from './enum/hotelbeds-language.enum';
import { HotelUsersEntity } from './entities/hotel_users.entity';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';
import * as bcrypt from 'bcrypt';
import { CreateBookingDto } from './dto/create-booking.dto';
import { HotelOrderEntity } from './entities/hotel_order.entity';

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
    @InjectRepository(HotelBookingsEntity)
    private readonly hotelBookingRepository: Repository<HotelBookingsEntity>,
    @InjectRepository(HotelBookHotelEntity)
    private readonly hotelBookHotelRepository: Repository<HotelBookHotelEntity>,
    @InjectRepository(HotelOrderEntity)
    private readonly hotelOrderRepository: Repository<HotelOrderEntity>,
    @InjectRepository(HotelUsersEntity)
    private readonly hotelUserRepository: Repository<HotelUsersEntity>,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.init();
  }

  init() {
    this.baseUrl = this.configService.get('HOTELS_BASE_URL');
    this.apiKey = this.configService.get('HOTELS_API_KEY');
    this.secretKey = this.configService.get('HOTELS_SECRET_KEY');
    this.apiPath = this.configService.get('HOTELS_API_PATH');
    this.contentApiPath = this.configService.get('HOTELS_CONTENT_API_PATH');
    this.contentTypesPath = this.configService.get(
      'HOTELS_CONTENT_TYPES_API_PATH',
    );
    this.geolocationRadius = this.configService.get(
      'HOTELS_GEOLOCATION_RADIUS',
    );
    this.geolocationUnit = this.configService.get('HOTELS_GEOLOCATION_UNIT');
    this.hotelsListLimit = this.configService.get('HOTELS_LIST_LIMIT');
  }

  exceptionHandler(error) {
    Logger.error(JSON.stringify(error));

    if (error.response) {
      if (error.response.data) {
        if (error.response.data?.error?.message) {
          if (error.response.data?.error?.message)
            throw new HttpException(
              error.response.data?.error?.message,
              error.response.status,
            );
          else throw new HttpException(error.message, error.response.status);
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
    return crypto
      .createHash('sha256')
      .update(
        `${this.apiKey}${this.secretKey}${Math.floor(
          new Date().getTime() / 1000,
        )}`,
      )
      .digest('hex');
  }

  header() {
    return {
      Accept: 'application/json',
      'Accept-encoding': 'gzip',
      'api-key': this.apiKey,
      'x-signature': this.signature,
    };
  }

  async register(payload: RegisterDto) {
    try {
      const item = plainToInstance(HotelUsersEntity, instanceToPlain(payload));
      const findUser = await this.hotelUserRepository.findOne({
        where: {
          email: item.email,
        },
      });
      if (!findUser) {
        item.password = await bcrypt.hash(item.password, 10);

        const user = await this.hotelUserRepository.save(item);
        return user;
      }
      throw new HttpException('This email has been registered', 400);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  async login(payload: LoginDto) {
    try {
      const user = await this.hotelUserRepository.findOne({
        where: {
          email: payload.email,
        },
      });

      if (!user) {
        throw new HttpException(
          'Account not found, please check the data you entered again',
          400,
        );
      }
      const matchPass = await bcrypt.compare(payload.password, user.password);
      if (!matchPass) {
        throw new HttpException(
          'Account not found, please check the data you entered again',
          400,
        );
      }
      return user;
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  async bookingList() {
    try {
      const books = await this.hotelBookingRepository.find();
      let data = [];
      for (let i = 0; i < books.length; i++) {
        const hotel = await this.hotelBookHotelRepository.find({
          id: books[i]['hotel'],
        });
        data.push({
          ...books[i],
          hotel,
        });
      }
      return data;
    } catch (err) {
      this.exceptionHandler(err);
    }
  }

  async orderList() {
    try {
      const data = await this.hotelOrderRepository.find();
      return data;
    } catch (err) {
      this.exceptionHandler(err);
    }
  }

  async checkStatusApi() {
    try {
      const response = await this.httpService.axiosRef.get('/status', {
        baseURL: `${this.baseUrl}${this.apiPath}`,
        headers: this.header(),
      });
      return response.data;
    } catch (err) {
      this.exceptionHandler(err);
    }
  }

  async getHotelDetail(id: string) {
    try {
      const response = await this.httpService.axiosRef.get(
        `/hotels/${id}/details`,
        {
          baseURL: `${this.baseUrl}${this.contentApiPath}`,
          headers: this.header(),
        },
      );

      return response.data;
    } catch (err) {
      this.exceptionHandler(err);
    }
  }

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
            unit: this.geolocationUnit,
          },
        },
        url: `/hotels`,
      });

      let hotelList = res.data.hotels.hotels;
      if (hotelList == undefined) {
        return [];
      }
      if (payload.offset != null) {
        const offsetData = this.limitPaginationData(
          payload.offset,
          this.hotelsListLimit,
        );
        hotelList = hotelList.slice(
          offsetData.startIndex,
          offsetData.lastIndex + 1,
        );
      }

      const codes = [];
      hotelList.forEach((element) => {
        codes.push(element.code);
      });

      const hotelDetail = await this.httpService.axiosRef.request({
        baseURL: `${this.baseUrl}${this.contentApiPath}`,
        headers: this.header(),
        method: 'GET',
        url: `/hotels?fields=images,address&codes=${codes}`,
      });

      const hotels = {};
      hotelDetail.data.hotels.forEach((element) => {
        hotels[element.code] = element;
      });

      return hotelList.map((element) => ({
        ...element,
        ...hotels[element.code],
      }));
    } catch (err) {
      this.exceptionHandler(err);
    }
  }

  async rateCommentDetail(query: GetRateCommentDetailQuery) {
    try {
      const date = new Date();
      const response = await this.httpService.axiosRef.get(
        `/ratecommentdetails?code=${
          query.code
        }&date=${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        {
          baseURL: `${this.baseUrl}${this.contentTypesPath}`,
          headers: this.header(),
        },
      );
      return response.data;
    } catch (err) {
      this.exceptionHandler(err);
    }
  }

  async checkRates(payload: GetCheckRatesHotelsDto) {
    try {
      const response = await this.httpService.axiosRef.request({
        baseURL: `${this.baseUrl}${this.apiPath}`,
        headers: this.header(),
        method: 'POST',
        data: {
          rooms: [payload],
          language: payload.language,
        },
        url: `/checkrates`,
      });
      return response.data;
    } catch (err) {
      this.exceptionHandler(err);
    }
  }

  async bookingDetail(rfCode: string, language?: HotelbedsLanguage) {
    try {
      const response = await this.httpService.axiosRef.get(
        `/bookings/${rfCode}?language=${language}`,
        {
          baseURL: `${this.baseUrl}${this.apiPath}`,
          headers: this.header(),
        },
      );
      return response.data;
    } catch (err) {
      this.exceptionHandler(err);
    }
  }

  async saveBookToDatabase(payload: CreateHotelsBookingDto) {
    try {
      let hotelDetail = await this.httpService.axiosRef.get(
        `/hotels/${payload.hotelCode}/details`,
        {
          baseURL: `${this.baseUrl}${this.contentApiPath}`,
          headers: this.header(),
        },
      );
      let hotelDetailData = hotelDetail.data.hotel;

      hotelDetailData.rooms = hotelDetailData.rooms.filter(
        (room) => room.roomCode == payload.rooms['roomCode'],
      );

      const facilities = hotelDetailData.facilities;
      for (let i = 0; i < facilities.length; i++) {
        if (
          facilities[i].facilityCode == 260 &&
          facilities[i].facilityGroupCode == 70
        ) {
          hotelDetailData.check_in = facilities[i].timeFrom;
          delete hotelDetailData.facilities[i];
          continue;
        }
        if (
          facilities[i].facilityCode == 390 &&
          facilities[i].facilityGroupCode == 70
        ) {
          hotelDetailData.check_out = facilities[i].timeTo;
          delete hotelDetailData.facilities[i];
        }
      }

      const data = [
        {
          user: payload.user,
          phone: payload.phone,
          email: payload.email,
          clientReference: payload.clientReference,
          status: 'PENDING',
          holder_name: payload.holder['name'],
          holder_surname: payload.holder['surname'],
          hotel: payload.hotelCode,
          check_in_time: hotelDetailData.check_in,
          check_out_time: hotelDetailData.check_out || '23.00:00',
          currency: payload.currency,
          pending_amount: payload.pending_amount,
          payment_status: 'PENDING',
          roomType: payload.rooms['roomName'],
          remark: payload.remark,
          cancellationPolicies: payload.cancellationPolicies,
          image: payload.image,
        },
        {
          code: payload.hotelCode,
          check_in: payload.check_in,
          check_out: payload.check_out,
          rateKey: payload.rooms['rateKey'],
          paxId: payload.rooms['paxes']['roomId'],
          roomType: payload.rooms['paxes']['type'],
          name: payload.hotelName,
          category_name: hotelDetailData.description.content,
          destination_name: hotelDetailData.name.content,
          zone_name: hotelDetailData.name,
          latitude: hotelDetailData.coordinates.latitude,
          longitude: hotelDetailData.coordinates.longitude,
          rooms: payload.rooms,
        },
        {
          rooms: payload.rooms,
          hotel_name: payload.hotelName,
          pending_amount: payload.pending_amount,
          cancellationPolicies: payload.cancellationPolicies,
          check_in: payload.check_in,
          check_out: payload.check_out,
          image: payload.image,
          status: 'PENDING',
        },
      ];

      const tbl_book_hotel = plainToInstance(
        HotelBookHotelEntity,
        instanceToPlain(data[1]),
      );
      const savedBookHotel = await this.hotelBookHotelRepository.save(
        tbl_book_hotel,
      );
      const bookHotelId = savedBookHotel.id;

      const tbl_book = plainToInstance(
        HotelBookingsEntity,
        instanceToPlain(data[0]),
      );
      tbl_book.hotel = bookHotelId;
      const savedBook = await this.hotelBookingRepository.save(tbl_book);
      const bookId = savedBook.booking_reference_code;

      const tbl_hotel_order = plainToInstance(
        HotelOrderEntity,
        instanceToPlain(data[2]),
      );
      tbl_hotel_order.hotel_id = bookHotelId;
      tbl_hotel_order.id = bookId;
      await this.hotelOrderRepository.save(tbl_hotel_order);

      return {
        statusCode: HttpStatus.CREATED,
        bookId,
        bookHotelId,
        ...data[0],
        ...data[1],
        ...data[2],
      };
    } catch (err) {
      this.exceptionHandler(err);
    }
  }

  async booking(payload: CreateBookingDto) {
    try {
      const book = await this.hotelBookingRepository.find({
        where: `"booking_reference_code" = '${payload.bookId}'`,
      });
      const hotel = await this.hotelBookHotelRepository.find({
        where: `"id" = '${payload.id}'`,
      });
      if (book[0].payment_status == 'PAID') {
        throw new HttpException("Payment Status cannot be 'PAID'", 400);
      }

      await this.hotelBookingRepository.update(
        {
          booking_reference_code: payload.bookId,
        },
        {
          status: 'CONFIRMED',
          payment_status: 'CONFIRMED',
          pending_amount: '0',
        },
      );
      const data = {
        phone: `1111`,
        email: `1111`,
        holder: {
          name: `111`,
          surname: `111`,
        },
        rooms: [
          {
            rateKey: `${hotel[0].rateKey}`,
            paxes: [
              {
                roomId: `${hotel[0].paxId}`,
                type: `${hotel[0].roomType}`,
                name: `${book[0].holder_name}`,
                surname: `${book[0].holder_surname}`,
              },
            ],
          },
        ],
        clientReference: `${book[0].clientReference}`,
      };

      await this.hotelOrderRepository.update(
        {
          id: payload.bookId,
        },
        {
          status: 'CONFIRMED',
          pending_amount: '0',
        },
      );

      const response = await this.httpService.axiosRef.request({
        baseURL: `${this.baseUrl}/hotel-api/1.2`,
        headers: this.header(),
        method: 'POST',
        data,
        url: '/bookings',
      });
      return response.data;
    } catch (err) {
      if (
        err.response.status == 500 &&
        err.message == 'Insufficient allotment'
      ) {
        await this.hotelBookingRepository.delete(payload.bookId);
        await this.hotelBookHotelRepository.delete(payload.id);
      }
      this.exceptionHandler(err);
    }
  }

  async cancelBooking(rfCode: string) {
    try {
      const checkPaymentStatus = await this.hotelBookingRepository.find({
        where: `"booking_reference_code" = '${rfCode}'`,
        select: ['payment_status'],
      });

      if (checkPaymentStatus[0].payment_status == 'PAID') {
        throw new HttpException("Payment Status cannot be 'PAID'", 400);
      }

      await this.hotelBookingRepository.update(
        {
          booking_reference_code: rfCode,
        },
        {
          status: 'CANCELLED',
          payment_status: 'CANCELLED',
        },
      );
      const hotelOrders = await this.hotelOrderRepository.update(
        {
          id: rfCode,
        },
        {
          status: 'CANCELLED',
        },
      );

      return checkPaymentStatus;
    } catch (err) {
      this.exceptionHandler(err);
    }
  }

  async getOrderById(id: string) {
    try {
      const hotelOrders = await this.hotelOrderRepository.find({
        where: `"id" = '${id}'`,
      });

      return hotelOrders;
    } catch (err) {
      this.exceptionHandler(err);
    }
  }

  limitPaginationData(offset, limit) {
    const startIndex = offset * limit;
    const lastIndex = (offset + 1) * limit - 1;
    return {
      startIndex,
      lastIndex,
    };
  }

  async toIDR(currency: string, amount: number) {
    try {
      const response = await this.httpService.axiosRef.get(
        `convert?from=${currency}&to=IDR`,
        {
          baseURL: 'https://api.exchangerate.host',
        },
      );
      const rate = Number(response.data.info.rate) + 100; // tambah 100 perak untuk menghandle kekurangan dari desimal
      return Math.round(amount * rate).toString();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
