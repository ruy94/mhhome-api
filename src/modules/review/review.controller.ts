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
import { ReviewService } from './review.service.js';
import { BulkCreateReviewDto } from './dto/bulk-create-review.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { ReviewQueryDto } from './dto/review-query.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';

@Controller('reviews')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('products/:productId')
  @RequirePermissions('review:view')
  async findReviewsByProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Query() pageOptionsDto: ReviewQueryDto,
  ) {
    return await this.reviewService.findReviewsByProduct(productId, pageOptionsDto);
  }

  @Get(':id')
  @RequirePermissions('review:view')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.reviewService.findOne(id);
  }

  @Post('bulk-create')
  @RequirePermissions('review:create')
  async bulkCreateReviews(@Body() dto: BulkCreateReviewDto) {
    return await this.reviewService.bulkCreateReviews(dto);
  }

  @Put(':id')
  @RequirePermissions('review:update')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReviewDto) {
    return await this.reviewService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('review:delete')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.reviewService.remove(id);
  }
}
