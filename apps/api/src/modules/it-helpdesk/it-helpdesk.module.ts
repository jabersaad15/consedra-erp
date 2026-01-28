import { Module } from '@nestjs/common';
import { ItHelpdeskService } from './it-helpdesk.service';
import { ItHelpdeskController } from './it-helpdesk.controller';

@Module({
  controllers: [ItHelpdeskController],
  providers: [ItHelpdeskService],
  exports: [ItHelpdeskService],
})
export class ItHelpdeskModule {}