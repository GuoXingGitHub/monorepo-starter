import { Module } from '@nestjs/common';

import { StorageProvider } from '../../gcloud/storage.provider';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';

@Module({
  imports: [StorageProvider],
  providers: [AttachmentService],
  controllers: [AttachmentController],
})
export class AttachmentModule {}
