import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';

import { VtpWebhookSignatureGuard } from './vtp-webhook-signature.guard.js';

describe('VtpWebhookSignatureGuard', () => {
  const context = (authorization: string | undefined, token: string | undefined) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: authorization ? { authorization } : {},
          body: token === undefined ? {} : { TOKEN: token },
        }),
      }),
    }) as ExecutionContext;

  const guard = (webhookSecret = 'shared-secret') =>
    new VtpWebhookSignatureGuard({ vtp: { webhookSecret } } as never);

  it('accepts any non-empty VTP authorization header when the shared secret matches', () => {
    expect(guard().canActivate(context('provider-managed-token', 'shared-secret'))).toBe(true);
  });

  it.each([
    [undefined, 'shared-secret'],
    ['provider-managed-token', undefined],
  ])('rejects missing webhook credentials', (authorization, token) => {
    expect(() => guard().canActivate(context(authorization, token))).toThrow(UnauthorizedException);
  });

  it('rejects an invalid or unconfigured shared secret', () => {
    expect(() => guard().canActivate(context('provider-managed-token', 'wrong-secret'))).toThrow(
      UnauthorizedException,
    );
    expect(() => guard('').canActivate(context('provider-managed-token', 'shared-secret'))).toThrow(
      UnauthorizedException,
    );
  });
});
