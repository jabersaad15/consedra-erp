import { Module } from '@nestjs/common';
import { OrgStructureService } from './org-structure.service';
import { OrgStructureController } from './org-structure.controller';

@Module({
  controllers: [OrgStructureController],
  providers: [OrgStructureService],
  exports: [OrgStructureService],
})
export class OrgStructureModule {}