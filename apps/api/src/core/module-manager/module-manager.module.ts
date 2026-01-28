import { Module } from '@nestjs/common';
import { ModuleManagerService } from './module-manager.service';
import { ModuleManagerController } from './module-manager.controller';

@Module({
  controllers: [ModuleManagerController],
  providers: [ModuleManagerService],
  exports: [ModuleManagerService],
})
export class ModuleManagerModule {}