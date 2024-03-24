import { CoreResponse } from 'src/shared/core/application/CoreResponse';
import { PostsByUser } from '../FindPostsByUserUseCase';

export interface FindPostsByUserUseCaseResponse extends CoreResponse {
  posts: PostsByUser[];
}
