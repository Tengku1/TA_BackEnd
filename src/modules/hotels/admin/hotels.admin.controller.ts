import { Body, Controller, Get, Param, Post, UseGuards, Put, Delete } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateHotelLocationsDto } from '../dto/create-hotel-locations.dto';
import { GetBookingListsQuery } from '../dto/get-booking-lists-query.dto';
import { GetHotelLocationsQuery } from '../dto/get-hotel-locations-query.dto';
import { PutHotelLocationsDto } from '../dto/put-hotel-locations.dto';
import { SetHotelConfigurationsDto } from '../dto/set-hotel-configurations.dto';
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

    @Get('/locations')
    @ApiOperation({
      summary: 'Get All Hotel Locations'
    })
    getAllLocation(@Query() request: GetHotelLocationsQuery){
      return this.adminHotelService.getHotelLocations(request);
    }

    @Get('/locations/:id')
    @ApiOperation({
      summary: 'Get All Hotel Locations By ID'
    })
    getAllLocationByID(@Param('id') id: number){
      return this.adminHotelService.getHotelLocationsByID(id);
    }
    
    @Post('/locations')
    @ApiOperation({
      summary: 'Create Locations'
    })
    createLocation(@Body() request: CreateHotelLocationsDto){
      return this.adminHotelService.createLocations(request);
    }

    @Post('/locations/initial')
    @ApiOperation({
      summary: 'Create Bulk Locations'
    })
    createBulkLocations(){
      return this.adminHotelService.createBulkLocations();
    }

    @Put('/locations/:id')
    @ApiOperation({
      summary: 'Change Location Data'
    })
    putLocation(@Param('id') id: number  ,@Body() request: PutHotelLocationsDto){
      return this.adminHotelService.updateLocations(id, request);
    }

    @Delete('/locations/:id')
    @ApiOperation({
      summary: 'Delete Location Data'
    })
    deleteLocation(@Param('id') id: number){
      return this.adminHotelService.deleteLocation(id);
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

    @Get('/fee-per-hotel')
    @ApiOperation({
      summary: 'Get Fee Per Hotels'
    })
    getFeePerHotels(){
      return this.adminHotelService.getFeePerHotels();
    }

    @Get('/books-report')
    @ApiOperation({
      summary: 'Get a total booking report'
    })
    getBooksReport(){
      return this.adminHotelService.getBooksReport();
    }

    @Post('/fee-per-hotel')
    @ApiOperation({
      summary: 'Set Fee Per Hotel'
    })
    setFeePerHotels(@Body() request: SetHotelConfigurationsDto){
      return this.adminHotelService.setFeePerHotels(request);
    }

    @Get('/detail/:id')
    @ApiOperation({
      summary: 'Get Hotel Details'
    })
    getDetailHotel(@Param('id') id: string){
      return this.adminHotelService.getHotelDetail(id);
    }
  }