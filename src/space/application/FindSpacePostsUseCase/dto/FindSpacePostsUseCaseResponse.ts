import { CoreResponse } from 'src/shared/core/application/CoreResponse';
import { SpacePost } from '../FindSpacePostsUseCase';

export interface FindSpacePostsUseCaseResponse extends CoreResponse {
  spacePosts: SpacePost[];
}
