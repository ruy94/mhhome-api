import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Public } from '../../common/decorators/public.decorator.js';
import {
  MarketplaceSnapshotQueryDto,
  MiniappMarketplaceCatalogQueryDto,
  MiniappMarketplaceOrderQueryDto,
} from './dto/marketplace-catalog-query.dto.js';
import { MarketplaceCatalogService } from './marketplace-catalog.service.js';
import { MarketplaceClientService } from './marketplace-client.service.js';
import { MarketplaceHmacGuard } from './marketplace-hmac.guard.js';
import { MarketplaceCommerceService } from './marketplace-commerce.service.js';
import { MarketplaceCartService } from './marketplace-cart.service.js';
import {
  MarketplaceConfirmReservationDto,
  MarketplaceRefundOrderDto,
  MarketplaceShipmentEventDto,
  MarketplaceSourceQuoteFinalizeDto,
  MarketplaceSourceQuotePreviewDto,
  MarketplaceSourceReserveDto,
} from './dto/marketplace-commerce.dto.js';
import {
  AddMarketplaceCartItemDto,
  MarketplaceCheckoutQuoteDto,
  MarketplaceCheckoutPrepareDto,
  UpdateMarketplaceCartItemDto,
} from './dto/marketplace-cart.dto.js';
import { MarketplaceIdempotencyInterceptor } from './marketplace-idempotency.interceptor.js';
import { MarketplaceReservationService } from './marketplace-reservation.service.js';

@Public()
@UseGuards(MarketplaceHmacGuard)
@Controller('marketplace')
export class MarketplaceSourceController {
  constructor(
    private readonly catalog: MarketplaceCatalogService,
    private readonly commerce: MarketplaceCommerceService,
    private readonly config: ConfigService,
    private readonly reservations: MarketplaceReservationService,
  ) {}

  @Get('sender-profile')
  getSenderProfile() {
    const useVtpSender =
      this.config.get<boolean>('shipping.vtp.enabled') === true
      && this.config.get<boolean>('shipping.spx.enabled') !== true;
    if (useVtpSender) {
      return {
        name: this.config.get<string>('shipping.vtp.sender.name') ?? '',
        phone: this.config.get<string>('shipping.vtp.sender.phone') ?? '',
        state: '',
        city: '',
        district: null,
        detailAddress: this.config.get<string>('shipping.vtp.sender.address') ?? '',
        addressVersion: 0,
        longitude: null,
        latitude: null,
        features: {
          electronicInvoiceEnabled:
            this.config.get<boolean>('app.features.electronicInvoiceEnabled') === true,
        },
      };
    }
    return {
      name: this.config.get<string>('shipping.spx.sender.name') ?? '',
      phone: this.config.get<string>('shipping.spx.sender.phone') ?? '',
      state: this.config.get<string>('shipping.spx.sender.state') ?? '',
      city: this.config.get<string>('shipping.spx.sender.city') ?? '',
      district: this.config.get<string>('shipping.spx.sender.district') || null,
      detailAddress: this.config.get<string>('shipping.spx.sender.detailAddress') ?? '',
      addressVersion: this.config.get<number>('shipping.spx.addressVersion') ?? 0,
      longitude: this.config.get<string>('shipping.spx.sender.longitude') || null,
      latitude: this.config.get<string>('shipping.spx.sender.latitude') || null,
      features: {
        electronicInvoiceEnabled:
          this.config.get<boolean>('app.features.electronicInvoiceEnabled') === true,
      },
      updatedAt: null,
    };
  }

  @Get('catalog/snapshot')
  getCatalogSnapshot(@Query() query: MarketplaceSnapshotQueryDto) {
    return this.catalog.getSnapshot(query);
  }

  @Post('commerce/quote-preview')
  quotePreview(@Body() dto: MarketplaceSourceQuotePreviewDto) {
    return this.commerce.preview(dto);
  }

  @Post('commerce/quote-finalize')
  quoteFinalize(@Body() dto: MarketplaceSourceQuoteFinalizeDto) {
    return this.commerce.finalize(dto);
  }

  @Post('commerce/reservations')
  @UseInterceptors(MarketplaceIdempotencyInterceptor)
  reserve(@Body() dto: MarketplaceSourceReserveDto) {
    return this.reservations.reserve(dto);
  }

  @Post('commerce/reservations/:reservationId/confirm')
  @UseInterceptors(MarketplaceIdempotencyInterceptor)
  confirmReservation(
    @Param('reservationId') reservationId: string,
    @Body() dto: MarketplaceConfirmReservationDto,
  ) {
    return this.reservations.confirm(reservationId, dto);
  }

  @Post('commerce/reservations/:reservationId/release')
  @UseInterceptors(MarketplaceIdempotencyInterceptor)
  releaseReservation(@Param('reservationId') reservationId: string) {
    return this.reservations.release(reservationId);
  }

  @Post('commerce/reservations/:reservationId/compensate')
  @UseInterceptors(MarketplaceIdempotencyInterceptor)
  compensateReservation(@Param('reservationId') reservationId: string) {
    return this.reservations.compensate(reservationId);
  }

  @Post('commerce/orders/:subOrderId/shipment-events')
  @UseInterceptors(MarketplaceIdempotencyInterceptor)
  applyShipmentEvent(
    @Param('subOrderId') subOrderId: string,
    @Body() dto: MarketplaceShipmentEventDto,
  ) {
    return this.reservations.applyShipmentEvent(subOrderId, dto);
  }

  @Post('commerce/orders/:subOrderId/refund')
  @UseInterceptors(MarketplaceIdempotencyInterceptor)
  refundOrder(
    @Param('subOrderId') subOrderId: string,
    @Body() dto: MarketplaceRefundOrderDto,
  ) {
    return this.reservations.refundOrder(subOrderId, dto.reason);
  }
}

@Public()
@Controller('miniapp/marketplace')
export class MiniappMarketplaceController {
  constructor(
    private readonly client: MarketplaceClientService,
    private readonly cart: MarketplaceCartService,
  ) {}

  @Get('products')
  async getProducts(@Query() query: MiniappMarketplaceCatalogQueryDto) {
    const response = await this.client.getCatalog(query);
    return { items: response.data, meta: response.meta };
  }

  @Get('products/:listingId')
  async getProduct(@Param('listingId') listingId: string) {
    const response = await this.client.getCatalogItem(listingId);
    return response.data;
  }

  @Get('users/:userId/cart')
  getCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.cart.get(userId);
  }

  @Post('users/:userId/cart/items')
  addCartItem(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: AddMarketplaceCartItemDto,
  ) {
    return this.cart.add(userId, dto);
  }

  @Patch('users/:userId/cart/items/:itemId')
  updateCartItem(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateMarketplaceCartItemDto,
  ) {
    return this.cart.update(userId, itemId, dto);
  }

  @Delete('users/:userId/cart/items/:itemId')
  removeCartItem(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('itemId') itemId: string,
  ) {
    return this.cart.remove(userId, itemId);
  }

  @Delete('users/:userId/cart')
  clearCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.cart.clear(userId);
  }

  @Get('shipping/providers')
  async shippingProviders() {
    return (await this.client.getShippingProviders()).data;
  }

  @Post('checkout/quote')
  checkoutQuote(@Body() dto: MarketplaceCheckoutQuoteDto) {
    return this.cart.quote(dto);
  }

  @Post('checkout/prepare')
  checkoutPrepare(@Body() dto: MarketplaceCheckoutPrepareDto) {
    return this.cart.prepare(dto);
  }

  @Get('checkout/:sessionId')
  checkoutSession(@Param('sessionId') sessionId: string) {
    return this.cart.getCheckoutSession(sessionId);
  }

  @Post('checkout/:sessionId/confirm')
  checkoutConfirm(@Param('sessionId') sessionId: string) {
    return this.cart.confirmCheckout(sessionId);
  }

  @Post('checkout/:sessionId/release')
  checkoutRelease(@Param('sessionId') sessionId: string) {
    return this.cart.releaseCheckout(sessionId);
  }

  @Get('users/:userId/orders')
  async getOrders(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: MiniappMarketplaceOrderQueryDto,
  ) {
    const response = await this.client.getOrders(userId, query);
    return { items: response.data, meta: response.meta };
  }

  @Get('users/:userId/orders/:orderId')
  async getOrder(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('orderId') orderId: string,
  ) {
    const response = await this.client.getOrder(userId, orderId);
    return response.data;
  }

  @Post('users/:userId/orders/:orderId/cancel')
  async cancelOrder(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('orderId') orderId: string,
  ) {
    const response = await this.client.cancelOrder(userId, orderId);
    return response.data;
  }
}
