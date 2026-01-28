import { Module } from '@nestjs/common';
import { Integration-hubService } from './integration-hub.service';
import { Integration-hubController } from './integration-hub.controller';

@Module({
  controllers: [Integration-hubController],
  providers: [Integration-hubService],
  exports: [Integration-hubService],
})
export class Integration-hubModule {}