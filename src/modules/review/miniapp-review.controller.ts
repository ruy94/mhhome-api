import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ReviewService } from './review.service.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { ReviewQueryDto } from './dto/review-query.dto.js';

@Public()
@Controller('miniapp/reviews')
export class MiniappReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('products/:productId')
  async findReviewsByProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Query() pageOptionsDto: ReviewQueryDto,
  ) {
    return await this.reviewService.findReviewsByProduct(productId, pageOptionsDto);
  }
}
