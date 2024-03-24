import { PromiseResult } from 'aws-sdk/lib/request';

export interface S3BucketUploaderResponse {
  s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
}
