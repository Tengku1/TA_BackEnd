import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateHotelsBookingDto } from './dto/create-hotels-booking.dto';
import { GetAvailabilityBookingDto } from './dto/get-availability-booking-dto';
import { GetAvailabilityByHotelDto } from './dto/get-availability-book-by-hotel.dto';
import { GetCheckRatesHotelsDto } from './dto/get-checkrates-hotels.dto';
import { HotelService } from './hotels.service';
import {  GetRateCommentDetailQuery } from './dto/get-rate-comment-detail-query.dto';
import { GetHotelByNameDto } from './dto/get-hotel-by-name.dto';
import HotelbedsLanguage from './enum/hotelbeds-language.enum';
import { GetBookingListsQuery } from './dto/get-booking-lists-query.dto';
import { HotelAdminService } from './admin/hotels.admin.service';
import { PaginationQuery } from './dto/pagination.query.dto';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';

@ApiTags('hotels')
@Controller('hotels')
export class HotelsController {
    constructor(
        private readonly hotelsService: HotelService,
        private readonly hotelAdminService: HotelAdminService
    ) { }

    @Get('/api-status')
    @ApiOperation({
      summary: 'Check API Status'
    })
    checkStatus(){
      return this.hotelsService.checkStatusApi();
    }

    @Post('/name/details')
    @ApiOperation({
      summary: 'Get Hotels By Name'
    })
    getHotelByName(@Body() request: GetHotelByNameDto, @Query() query: PaginationQuery){
      return this.hotelsService.getHotelByName(request, query);
    }

    @Get('/ratecomment')
    @ApiOperation({
      summary: 'Get Rate Comment Detail'
    })
    getRateCommentDetail(@Query() request: GetRateCommentDetailQuery){
      return this.hotelsService.rateCommentDetail(request);
    }
    
    @Get('/:id')
    @ApiOperation({
      summary: 'Get Hotel Details'
    })
    getDetailHotel(@Param('id') id: string){
      return this.hotelsService.getHotelDetail(id);
    }

    @Get('/bookings/lists')
    @ApiOperation({
      summary: 'Get Booking Lists'
    })
    getBookingList(@Query() request: GetBookingListsQuery){
      return this.hotelAdminService.bookingList(request);
    }

    @Post('/bookings/availability')
    @ApiOperation({
      summary: 'Get Availability Hotels'
    })
    getAvailabilityHotel(@Body() request: GetAvailabilityBookingDto){
      return this.hotelsService.checkBookingAvailability(request);
    }

    @Post('/bookings/availability/hotel')
    @ApiOperation({
      summary: 'Get Availability Hotels By Code'
    })
    getAvailabilityHotelByCode(@Body() request: GetAvailabilityByHotelDto){
      return this.hotelsService.checkBookingAvailabilityByHotelCode(request);
    }

    @Post('/check-rates')
    @ApiOperation({
      summary: 'Get Check Rate Hotel When Booking'
    })
    checkRateHotels(@Body() request: GetCheckRatesHotelsDto){
      return this.hotelsService.checkRates(request);
    }

    @Post('/bookings')
    @ApiOperation({
      summary: 'Create Bookings Hotels'
    })
    bookings(@Body() request: CreateHotelsBookingDto){
      return this.hotelsService.booking(request);
    }

    @Get('/bookings/:rfCode')
    @ApiOperation({
      summary: 'Get Booking Detail'
    })
    getBookingDetail(@Param('rfCode') rfCode: string, @Query('language') language: HotelbedsLanguage = HotelbedsLanguage.ENG){
      return this.hotelsService.bookingDetail(rfCode, language);
    }

    @Delete('/bookings/:rfCode')
    @ApiOperation({
      summary: 'Cancelling Booking'
    })
    deleteBooking(@Param('rfCode') rfCode: string, @Query('language') language: HotelbedsLanguage = HotelbedsLanguage.ENG){
      return this.hotelsService.cancelBooking(rfCode, language);
    }

    @Post('/register')
    @ApiOperation({
      summary: 'Register an Account'
    })
    registerAccount(@Body() request: RegisterDto){
      return this.hotelsService.register(request);
    }

    @Post('/login')
    @ApiOperation({
      summary: 'Log in an Account'
    })
    login(@Body() request: LoginDto){
      return this.hotelsService.login(request);
    }
}