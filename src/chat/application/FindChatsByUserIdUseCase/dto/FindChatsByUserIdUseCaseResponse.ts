import { CoreResponse } from 'src/shared/core/application/CoreResponse';
import { UseChat } from '../FindChatsByUserIdUseCase';

export interface FindChatsByUserIdUseCaseResponse extends CoreResponse {
  chats: UseChat[];
}
