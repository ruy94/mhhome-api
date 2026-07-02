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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentWebsiteUser } from '../../common/decorators/current-website-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { WebsiteJwtAuthGuard } from '../../common/guards/website-jwt-auth.guard.js';
import { AddressService } from './address.service.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';

@ApiTags('website-addresses')
@Public()
@UseGuards(WebsiteJwtAuthGuard)
@Controller('website/addresses')
export class WebsiteAddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo địa chỉ giao hàng cho khách hàng website đang đăng nhập' })
  async create(@CurrentWebsiteUser('id') userId: number, @Body() data: CreateAddressDto) {
    return this.addressService.create(userId, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật địa chỉ giao hàng của khách hàng website đang đăng nhập' })
  async update(
    @CurrentWebsiteUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAddressDto,
  ) {
    return this.addressService.update(id, userId, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa mềm địa chỉ giao hàng của khách hàng website đang đăng nhập' })
  async remove(@CurrentWebsiteUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.addressService.remove(id, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách địa chỉ giao hàng của khách hàng website đang đăng nhập' })
  async findAllByUser(
    @CurrentWebsiteUser('id') userId: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.addressService.findAll(userId, pageOptionsDto);
  }
}
