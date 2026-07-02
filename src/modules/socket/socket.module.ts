import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AppGateway } from './app/app.gateway.js';

@Global()
@Module({
  imports: [JwtModule],
  providers: [AppGateway],
  exports: [AppGateway],
})
export class SocketModule {}
