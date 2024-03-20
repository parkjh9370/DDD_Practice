import { CoreResponse } from 'src/shared/core/application/CoreResponse';

export interface SignInUseCaseResponse extends CoreResponse {
  accessToken: string;
  refreshToken: string;
}
