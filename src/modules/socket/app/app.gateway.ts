import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import type { JwtPayload } from '../../auth/dto/jwt.dto.js';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/api/v1',
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(AppGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const rawToken = client.handshake.auth?.['token'] || client.handshake.headers.authorization;
      const authHeader = typeof rawToken === 'string' ? rawToken : null;
      if (!authHeader) throw new Error('Missing Authorization Token');

      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
      if (!token) throw new Error('Missing Authorization Token');

      const secret =
        this.configService.get<string>('app.jwt.accessSecret') ||
        this.configService.get<string>('JWT_ACCESS_SECRET');
      if (!secret) throw new Error('Missing JWT access secret');

      const payload = this.jwtService.verify<JwtPayload>(token, { secret });
      const adminId = payload.sub;

      client.data = { adminId };
      await client.join(`admin_${adminId}`);
      await client.join('tenant_wallet');

      this.logger.log(`Admin socket connected: ${client.id} (${payload.username})`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Socket connection rejected: ${message}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Admin socket disconnected: ${client.id}`);
  }

  emitBalanceUpdate(newBalance: number): void {
    this.server.to('tenant_wallet').emit('balance_update', { balance: newBalance });
    this.logger.log(`Emitted tenant wallet balance update: ${newBalance}`);
  }

  emitNotificationToAdmin(adminId: string, message: string): void {
    this.server.to(`admin_${adminId}`).emit('notification', { message });
  }

  emitTenantNotification(message: string): void {
    this.server.to('tenant_wallet').emit('notification', { message });
  }
}
