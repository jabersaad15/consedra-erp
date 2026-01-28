import { Module } from '@nestjs/common';
import { Org-structureService } from './org-structure.service';
import { Org-structureController } from './org-structure.controller';

@Module({
  controllers: [Org-structureController],
  providers: [Org-structureService],
  exports: [Org-structureService],
})
export class Org-structureModule {}