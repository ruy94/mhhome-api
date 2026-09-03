import { ArgumentsHost, BadGatewayException, HttpStatus } from '@nestjs/common';

import { GlobalExceptionFilter } from './global-exception.filter.js';

function createHost() {
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const request = { method: 'POST', url: '/api/v1/zbs/campaigns' };
  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => request,
    }),
  } as ArgumentsHost;

  return { host, response };
}

describe('GlobalExceptionFilter', () => {
  it('preserves payload-too-large errors as HTTP 413', () => {
    const { host, response } = createHost();
    const exception = Object.assign(new Error('request entity too large'), {
      status: HttpStatus.PAYLOAD_TOO_LARGE,
      type: 'entity.too.large',
    });

    new GlobalExceptionFilter().catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.PAYLOAD_TOO_LARGE);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
        message: 'Dữ liệu gửi lên vượt quá giới hạn cho phép',
        error: 'Payload Too Large',
      }),
    );
  });

  it('preserves safe structured error details', () => {
    const { host, response } = createHost();

    const exception = new BadGatewayException({
      message: 'Không thể tạo vận đơn',
      error: 'Bad Gateway',
      code: 'VTP_SHIPPING_FAILED',
      details: { failCount: 1 },
    });

    new GlobalExceptionFilter().catch(exception, host);

    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'VTP_SHIPPING_FAILED',
        details: { failCount: 1 },
      }),
    );
  });

  it('keeps unknown errors as HTTP 500', () => {
    const { host, response } = createHost();

    new GlobalExceptionFilter().catch(new Error('secret failure'), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Internal server error' }),
    );
  });
});
