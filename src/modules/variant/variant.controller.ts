import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Put, UseGuards } from '@nestjs/common';
import { VariantService } from './variant.service.js';
import { UpdateVariantDto } from './dto/update-variant.dto.js';
import { LinkSaleworkVariantDto } from './dto/link-salework-variant.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';

@Controller('variants')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Get(':id')
  @RequirePermissions('variant:view')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.variantService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('variant:update')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVariantDto) {
    return await this.variantService.update(id, dto);
  }

  @Patch(':id/salework-link')
  @RequirePermissions('salework:warehouse')
  async linkSalework(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: LinkSaleworkVariantDto,
  ) {
    return await this.variantService.linkSalework(id, dto);
  }

  @Delete(':id/salework-link')
  @RequirePermissions('salework:warehouse')
  async unlinkSalework(@Param('id', ParseIntPipe) id: number) {
    return await this.variantService.unlinkSalework(id);
  }

  @Delete(':id')
  @RequirePermissions('variant:delete')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.variantService.remove(id);
  }
}
