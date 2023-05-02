import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateHotelsBookingDto } from './dto/create-hotels-booking.dto';
import { GetAvailabilityBookingDto } from './dto/get-availability-booking-dto';
import { GetAvailabilityByHotelDto } from './dto/get-availability-book-by-hotel.dto';
import { GetCheckRatesHotelsDto } from './dto/get-checkrates-hotels.dto';
import { PutHotelsBookingDto } from './dto/put-hotels-booking-dto';
import { HotelService } from './hotels.service';
import { GetHotelLocationsQuery } from './dto/get-hotel-locations-query.dto';
import {  GetRateCommentDetailQuery } from './dto/get-rate-comment-detail-query.dto';
import { GetHotelByNameDto } from './dto/get-hotel-by-name.dto';
import HotelbedsLanguage from './enum/hotelbeds-language.enum';
import { GetBookingListsQuery } from './dto/get-booking-lists-query.dto';
import { HotelAdminService } from './admin/hotels.admin.service';
import { PaginationQuery } from './dto/pagination.query.dto';

@ApiTags('hotels')
@Controller('hotels')
export class HotelsController {
    constructor(
        private readonly hotelsService: HotelService,
        private readonly hotelAdminService: HotelAdminService
    ) { }

    @Get('/fee-per-hotel')
    @ApiOperation({
      summary: 'Get Fee Per Hotels'
    })
    getFeePerHotels(){
      return this.hotelsService.getFeePerHotels();
    }

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

    @Get('/locations')
    @ApiOperation({
      summary: 'Get All Hotel Locations'
    })
    getAllLocation(@Query() request: GetHotelLocationsQuery){
      return this.hotelsService.getHotelLocations(request);
    }

    @Get('/locations/:id')
    @ApiOperation({
      summary: 'Get All Hotel Locations By ID'
    })
    getAllLocationByID(@Param('id') id: number){
      return this.hotelsService.getHotelLocationsByID(id);
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

    @Put('/bookings/:id')
    @ApiOperation({
      summary: 'Update Booking'
    })
    putBooking(@Param('id') id: string, @Body() request: PutHotelsBookingDto){
      return this.hotelsService.putBooking(id, request);
    }

    @Delete('/bookings/:rfCode')
    @ApiOperation({
      summary: 'Cancelling Booking'
    })
    deleteBooking(@Param('rfCode') rfCode: string, @Query('language') language: HotelbedsLanguage = HotelbedsLanguage.ENG){
      return this.hotelsService.cancelBooking(rfCode, language);
    }

    @Get('/bookings/reconfirmations')
    @ApiOperation({
      summary: 'Get Reconfirmation Booking By Email'
    })
    getReconfirmationBook(){
      return this.hotelsService.reconfirmationBook();
    }
}