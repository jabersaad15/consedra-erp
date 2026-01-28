import { Module } from '@nestjs/common';
import { Forms-builderService } from './forms-builder.service';
import { Forms-builderController } from './forms-builder.controller';

@Module({
  controllers: [Forms-builderController],
  providers: [Forms-builderService],
  exports: [Forms-builderService],
})
export class Forms-builderModule {}