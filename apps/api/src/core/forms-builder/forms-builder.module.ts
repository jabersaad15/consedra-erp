import { Module } from '@nestjs/common';
import { FormsBuilderService } from './forms-builder.service';
import { FormsBuilderController } from './forms-builder.controller';

@Module({
  controllers: [FormsBuilderController],
  providers: [FormsBuilderService],
  exports: [FormsBuilderService],
})
export class FormsBuilderModule {}