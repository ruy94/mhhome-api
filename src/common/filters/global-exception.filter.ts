import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();

      if (typeof body === 'string') {
        message = body;
        error = exception.name;
      } else if (typeof body === 'object' && body !== null) {
        const b = body as Record<string, unknown>;
        const raw = b['message'];
        message = Array.isArray(raw) ? (raw[0] as string) : ((raw as string) ?? message);
        error = (b['error'] as string) ?? exception.name;
      }
    } else if (this.getStatus(exception) === HttpStatus.PAYLOAD_TOO_LARGE) {
      status = HttpStatus.PAYLOAD_TOO_LARGE;
      message = 'Dữ liệu gửi lên vượt quá giới hạn cho phép';
      error = 'Payload Too Large';
    } else {
      const err = exception instanceof Error ? exception : new Error(String(exception));
      this.logger.error(`${request.method} ${request.url}`, err.stack);
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getStatus(exception: unknown): number | undefined {
    if (typeof exception !== 'object' || exception === null) return undefined;

    const value = exception as { status?: unknown; statusCode?: unknown };
    const status = value.status ?? value.statusCode;
    return typeof status === 'number' ? status : undefined;
  }
}
