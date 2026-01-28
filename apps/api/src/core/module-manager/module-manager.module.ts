import { Module } from '@nestjs/common';
import { Module-managerService } from './module-manager.service';
import { Module-managerController } from './module-manager.controller';

@Module({
  controllers: [Module-managerController],
  providers: [Module-managerService],
  exports: [Module-managerService],
})
export class Module-managerModule {}