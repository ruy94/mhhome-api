import { Module } from '@nestjs/common';

import { CartService } from './cart.service.js';
import { MiniappCartController } from './miniapp-cart.controller.js';
import { WebsiteCartController } from './website-cart.controller.js';

@Module({
  controllers: [MiniappCartController, WebsiteCartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
