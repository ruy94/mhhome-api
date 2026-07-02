import { Module } from '@nestjs/common';
import { ReviewService } from './review.service.js';
import { ReviewController } from './review.controller.js';
import { MiniappReviewController } from './miniapp-review.controller.js';
import { WebsiteReviewController } from './website-review.controller.js';
import { UploadModule } from '../upload/upload.module.js';

@Module({
  imports: [UploadModule],
  controllers: [ReviewController, MiniappReviewController, WebsiteReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
