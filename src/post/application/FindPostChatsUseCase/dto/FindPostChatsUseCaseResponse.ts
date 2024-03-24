import { CoreResponse } from 'src/shared/core/application/CoreResponse';
import { PostChat } from '../FindPostChatsUseCase';

export interface FindPostChatsUseCaseResponse extends CoreResponse {
  postChats: PostChat[];
}
