import { Module } from '@nestjs/common';

/** Controllers */
import { UploadController } from './presentation/UploadController';

/** UseCases */
import { S3BucketUploader, S3_BUCKET_UPLOADER } from './application/UploadFileUseCase/S3BucketUploader/S3BucketUploader';
import { UploadFileUseCase } from './application/UploadFileUseCase/UploadFileUseCase';

@Module({
  exports: [],
  controllers: [UploadController],
  providers: [
    UploadFileUseCase,
    {
      provide: S3_BUCKET_UPLOADER,
      useClass: S3BucketUploader,
    },
  ],
})
export class UploadModule {}
