import { Controller, Get, Param } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetBookingListsQuery } from '../dto/get-booking-lists-query.dto';
import { HotelAdminService } from './hotels.admin.service';
import { PaginationQuery } from '../dto/pagination.query.dto';

@ApiTags('admin')
@Controller('admin/hotels')
// @ApiBearerAuth()
// @RolesAllowed("ADMIN")
export class HotelsAdminController {
    constructor(
        private readonly adminHotelService: HotelAdminService
    ) { }

    @Get('/')
    @ApiOperation({
      summary: 'Get All Hotels'
    })
    getAll(@Query() query: PaginationQuery){
      return this.adminHotelService.getAll(query);
    }

    @Get('/import-hotels')
    @ApiOperation({
      summary: 'Import All Hotels To Database'
    })
    importHotels(){
      this.adminHotelService.importHotels();
    }

    @Get('/bookings/lists')
    @ApiOperation({
      summary: 'Get Booking Lists'
    })
    getBookingList(@Query() request: GetBookingListsQuery){
      return this.adminHotelService.bookingList(request);
    }

    @Get('/bookings/:rfCode')
    @ApiOperation({
      summary: 'Get Booking Detail'
    })
    getBookingDetail(@Param('rfCode') rfCode: string){
      return this.adminHotelService.bookingDetail(rfCode);
    }

    @Get('/books-report')
    @ApiOperation({
      summary: 'Get a total booking report'
    })
    getBooksReport(){
      return this.adminHotelService.getBooksReport();
    }

    @Get('/detail/:id')
    @ApiOperation({
      summary: 'Get Hotel Details'
    })
    getDetailHotel(@Param('id') id: string){
      return this.adminHotelService.getHotelDetail(id);
    }
  }