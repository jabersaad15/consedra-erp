import { Module } from '@nestjs/common';
import { It-helpdeskService } from './it-helpdesk.service';
import { It-helpdeskController } from './it-helpdesk.controller';

@Module({
  controllers: [It-helpdeskController],
  providers: [It-helpdeskService],
  exports: [It-helpdeskService],
})
export class It-helpdeskModule {}