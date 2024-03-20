import { CoreResponse } from 'src/shared/core/application/CoreResponse';

export interface IssueTokenUseCaseResponse extends CoreResponse {
  token: string;
}
