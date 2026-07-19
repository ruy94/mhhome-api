import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Public } from '../../common/decorators/public.decorator.js';

@Public()
@Controller('public/config')
export class PublicConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getConfig() {
    return {
      electronicInvoiceEnabled:
        this.configService.get<boolean>('app.features.electronicInvoiceEnabled') ===
        true,
    };
  }
}
