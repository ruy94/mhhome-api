import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator.js';
import { CreateWebsiteUserDto } from './dto/create-website-user.dto.js';
import { UpdateWebsiteUserDto } from './dto/update-website-user.dto.js';
import { UserService } from './user.service.js';

@ApiTags('website-users')
@Public()
@Controller('website/users')
export class WebsiteUserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo hoặc cập nhật user website' })
  async create(@Body() data: CreateWebsiteUserDto) {
    return this.userService.createOrUpdateWebsiteUser(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết user website' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật user website' })
  async update(@Param('id') id: string, @Body() data: UpdateWebsiteUserDto) {
    return this.userService.updateWebsiteUser(Number(id), data);
  }
}
