import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateHotelsBookingDto } from './dto/create-hotels-booking.dto';
import { GetAvailabilityBookingDto } from './dto/get-availability-booking-dto';
import { GetCheckRatesHotelsDto } from './dto/get-checkrates-hotels.dto';
import { HotelService } from './hotels.service';
import {  GetRateCommentDetailQuery } from './dto/get-rate-comment-detail-query.dto';
import HotelbedsLanguage from './enum/hotelbeds-language.enum';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';
import { CreateBookingDto } from './dto/create-booking.dto';

@ApiTags('hotels')
@Controller('hotels')
export class HotelsController {
    constructor(
        private readonly hotelsService: HotelService
    ) { }

    @Get('/api-status')
    @ApiOperation({
      summary: 'Check API Status'
    })
    checkStatus(){
      return this.hotelsService.checkStatusApi();
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
    getBookingList(){
      return this.hotelsService.bookingList();
    }

    @Get('/order/lists')
    @ApiOperation({
      summary: 'Get Order Lists'
    })
    getOrderLists(){
      return this.hotelsService.orderList();
    }

    @Post('/bookings/availability')
    @ApiOperation({
      summary: 'Get Availability Hotels'
    })
    getAvailabilityHotel(@Body() request: GetAvailabilityBookingDto){
      return this.hotelsService.checkBookingAvailability(request);
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
    bookings(@Body() request: CreateBookingDto){
      return this.hotelsService.booking(request);
    }

    @Post('/bookings/database')
    @ApiOperation({
      summary: 'Save Booking Hotel To Database'
    })
    saveBookToDatabase(@Body() request: CreateHotelsBookingDto){
      return this.hotelsService.saveBookToDatabase(request);
    }

    @Get('/bookings/:rfCode')
    @ApiOperation({
      summary: 'Get Booking Detail'
    })
    getBookingDetail(@Param('rfCode') rfCode: string, @Query('language') language: HotelbedsLanguage = HotelbedsLanguage.ENG){
      return this.hotelsService.bookingDetail(rfCode, language);
    }

    @Get('/order/:id')
    @ApiOperation({
      summary: 'Get Order Detail'
    })
    getOrderDetail(@Param('id') id: string){
      return this.hotelsService.getOrderById(id);
    }

    @Delete('/bookings/:rfCode')
    @ApiOperation({
      summary: 'Cancelling Booking'
    })
    deleteBooking(@Param('rfCode') rfCode: string){
      return this.hotelsService.cancelBooking(rfCode);
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