import { Module } from '@nestjs/common';
import { ProductService } from './product.service.js';
import { ProductController } from './product.controller.js';
import { MiniappProductController } from './miniapp-product.controller.js';
import { WebsiteProductController } from './website-product.controller.js';
import { UploadModule } from '../upload/upload.module.js';
import { MarketplaceModule } from '../marketplace/marketplace.module.js';

@Module({
  imports: [UploadModule, MarketplaceModule],
  controllers: [ProductController, MiniappProductController, WebsiteProductController],
  providers: [ProductService],
})
export class ProductModule {}
