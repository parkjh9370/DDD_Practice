import * as AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { Injectable, InternalServerErrorException, UseFilters } from '@nestjs/common';

import { config } from 'src/config/config';
import { UseCase } from 'src/shared/core/application/UseCase';
import { AllExceptionsFilter } from 'src/shared/filters/AllExceptionsFilter';
import { S3BucketUploaderRequest } from './dto/S3BucketUploaderRequest';
import { S3BucketUploaderResponse } from './dto/S3BucketUploaderResponse';

export const S3_BUCKET_UPLOADER = Symbol('S3_BUCKET_UPLOADER');

@Injectable()
export class S3BucketUploader implements UseCase<S3BucketUploaderRequest, S3BucketUploaderResponse> {
  private readonly awsS3: AWS.S3;

  constructor() {
    this.awsS3 = new AWS.S3({
      accessKeyId: config.S3.ACCESS_KEY_ID,
      secretAccessKey: config.S3.SECRET_ACCESS_KEY,
      region: config.S3.REGION,
    });
  }

  @UseFilters(AllExceptionsFilter)
  async execute(request: S3BucketUploaderRequest): Promise<S3BucketUploaderResponse> {
    try {
      const { bucket, fileUniqueKey, buffer, contentType } = request;

      const s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError> = await this.awsS3
        .putObject({
          Bucket: bucket,
          Key: fileUniqueKey,
          Body: buffer,
          ContentType: contentType,
          ACL: 'public-read',
        })
        .promise();

      return { s3Object };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
