import { Global, Module } from '@nestjs/common';

import { SionHubClientService } from './sion-hub-client.service.js';
import { SionHubCredentialService } from './sion-hub-credential.service.js';

@Global()
@Module({
  providers: [SionHubClientService, SionHubCredentialService],
  exports: [SionHubClientService, SionHubCredentialService],
})
export class SionHubModule {}
