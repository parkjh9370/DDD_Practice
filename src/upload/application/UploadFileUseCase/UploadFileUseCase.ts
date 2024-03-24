import { v4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';

import { UseCase } from 'src/shared/core/application/UseCase';
import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { config } from 'src/config/config';
import { S3BucketUploader, S3_BUCKET_UPLOADER } from './S3BucketUploader/S3BucketUploader';
import { UploadFileUseCaseRequest } from './dto/UploadFileUseCaseRequest';
import { UploadFileUseCaseResponse } from './dto/UploadFileUseCaseResponse';

@Injectable()
export class UploadFileUseCase implements UseCase<UploadFileUseCaseRequest, UploadFileUseCaseResponse> {
  constructor(
    @Inject(S3_BUCKET_UPLOADER)
    private readonly s3BucketUploader: S3BucketUploader,
  ) {}

  async execute(request: UploadFileUseCaseRequest): Promise<UploadFileUseCaseResponse> {
    const { buffer, contentType } = request;

    const bucket = config.NODE_ENV === 'development' ? 'practice-v1-files-dev' : 'practice-v1-files';
    const fileUniqueKey = v4() + '.' + contentType.split('/')[1];

    await this.s3BucketUploader.execute({
      bucket: bucket,
      fileUniqueKey: fileUniqueKey,
      buffer: buffer,
      contentType: contentType,
    });

    const fileUrl = `https://${bucket}.s3.amazonaws.com/${fileUniqueKey}`;

    return { code: RESPONSE_CODE.SUCCESS, fileUrl: fileUrl };
  }
}
