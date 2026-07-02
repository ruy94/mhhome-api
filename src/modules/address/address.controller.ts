import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { Public } from '../../common/decorators/public.decorator.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { AddressService } from './address.service.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';

@Public()
@Controller('miniapp/users/:userId/addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(@Param('userId', ParseIntPipe) userId: number, @Body() data: CreateAddressDto) {
    return this.addressService.create(userId, data);
  }

  @Put(':id')
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAddressDto,
  ) {
    return this.addressService.update(id, userId, data);
  }

  @Delete(':id')
  async remove(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.addressService.remove(id, userId);
  }

  @Get()
  async findAllByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.addressService.findAll(userId, pageOptionsDto);
  }
}
