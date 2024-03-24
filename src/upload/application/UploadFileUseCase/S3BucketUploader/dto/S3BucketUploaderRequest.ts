export interface S3BucketUploaderRequest {
  bucket: string;
  fileUniqueKey: string;
  buffer: string | Buffer | (string | Buffer)[];
  contentType: string;
}
