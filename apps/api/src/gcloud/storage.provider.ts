import { join } from 'path';

import { Bucket, Storage, StorageOptions } from '@google-cloud/storage';
import { Injectable, Logger } from '@nestjs/common';

import AppConfig from '../config/app';
import AttachmentConfig from '../config/attachment';

@Injectable()
export class StorageProvider {
  private readonly _storage: Storage;
  private readonly _defaultBucket: Bucket;

  constructor() {
    const config: StorageOptions = {};
    if (AppConfig.isDevelopment()) {
      Logger.log(
        'Application is running locally, using keyfile.json credentials to connect to Google Cloud Storage',
      );
      config.keyFilename = join('..', '..', 'keyfile.json');
    }
    this._storage = new Storage(config);
    Logger.log(
      `Default Google Cloud Storage bucket: ${AttachmentConfig.bucket}`,
    );
    this._defaultBucket = this.storage.bucket(AttachmentConfig.bucket);
  }

  get storage(): Storage {
    return this._storage;
  }

  get defaultBucket(): Bucket {
    return this._defaultBucket;
  }

  async getDefaultBucketResumableUploadUrl(fileId: string): Promise<string> {
    const gcsFile = this._defaultBucket.file(fileId);
    const urls = await gcsFile.createResumableUpload({
      origin: AttachmentConfig.origin,
    });
    return urls[0];
  }
}
