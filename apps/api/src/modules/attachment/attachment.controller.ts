import { uuid } from 'uuidv4';

import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import AttachmentConfig from '../../config/attachment';
import { StorageProvider } from '../../gcloud/storage.provider';

@ApiTags('attachments')
@Controller('attachments')
export class AttachmentController {
  constructor(private readonly storageProvider: StorageProvider) {}

  @Get()
  async getAttachments() {
    try {
      return this.storageProvider.defaultBucket
        .getFiles({ maxResults: 30, directory: 'attachments' })
        .then(([files]) => files.map(file => file.name));
    } catch (ex) {
      Logger.error(ex);
      throw ex;
    }
  }

  @Post('upload')
  async uploadAttachment(
    @Body('contentType') contentType: string,
    @Body('filename') filename: string,
  ) {
    Logger.log('Generating Google Cloud Storage attachment URL');
    const id = filename || uuid();
    const file = this.storageProvider.defaultBucket.file(`attachments/${id}`);

    const [url] = await file.createResumableUpload({
      origin: AttachmentConfig.origin,
      metadata: {
        contentType,
      },
      public: true,
    });

    return {
      id,
      url,
    };
  }
}
