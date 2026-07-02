import { Module } from '@nestjs/common';

import { AclController } from './acl.controller.js';
import { AclService } from './acl.service.js';

@Module({
  controllers: [AclController],
  providers: [AclService],
})
export class AclModule {}
