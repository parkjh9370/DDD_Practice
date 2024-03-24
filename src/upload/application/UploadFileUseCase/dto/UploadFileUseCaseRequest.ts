export interface UploadFileUseCaseRequest {
  buffer: string | Buffer | (string | Buffer)[];
  contentType: string;
}
