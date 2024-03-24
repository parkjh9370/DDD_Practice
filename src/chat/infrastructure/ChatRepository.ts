import { Chat } from '../domain/Chat';

export const CHAT_REPOSITORY = Symbol('CHAT_REPOSITORY');

export interface ChatRepositoryFindOneByOptions {
  id?: number;
}

export interface ChatRepositoryFindByOptions {
  postId?: number;
  userId?: number;
}

export interface ChatRepository {
  save(chat: Chat): Promise<number>;

  findOneByOptions(options: ChatRepositoryFindOneByOptions): Promise<Chat>;

  findByOptions(options: ChatRepositoryFindByOptions): Promise<Chat[]>;

  delete(chat: Chat): Promise<void>;
}
