import { CoreResponse } from 'src/shared/core/application/CoreResponse';
import { Space } from 'src/space/domain/Space';

export interface FindOneSpaceUseCaseResponse extends CoreResponse {
  space: Space;
}
