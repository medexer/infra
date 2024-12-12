import { AppLogger } from './logger/logger.service';
import { CommonService } from './services/common.service';
import { forwardRef, Global, Module } from '@nestjs/common';
import { AccountServiceModule } from '@app/account-service';

@Global()
@Module({
  providers: [
    CommonService,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
  ],
  exports: [CommonService],
  imports: [forwardRef(() => AccountServiceModule)],
})
export class CommonModule {}
