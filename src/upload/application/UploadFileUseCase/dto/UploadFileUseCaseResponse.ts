import { CoreResponse } from 'src/shared/core/application/CoreResponse';

export interface UploadFileUseCaseResponse extends CoreResponse {
  fileUrl: string;
}
