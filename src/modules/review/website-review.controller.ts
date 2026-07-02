import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { ReviewQueryDto } from './dto/review-query.dto.js';
import { ReviewService } from './review.service.js';

@Public()
@Controller('website/reviews')
export class WebsiteReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('products/:productId')
  async findReviewsByProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Query() pageOptionsDto: ReviewQueryDto,
  ) {
    return await this.reviewService.findReviewsByProduct(productId, pageOptionsDto);
  }
}
