import { ChatReply } from '../domain/ChatReply';

export const CHAT_REPLY_REPOSITORY = Symbol('CHAT_REPLY_REPOSITORY');

export interface ChatReplyRepositoryFindOneByOptions {
  id?: number;
}

export interface ChatReplyRepositoryFindByOptions {
  userId?: number;
}

export interface ChatReplyRepository {
  save(chatReply: ChatReply): Promise<number>;

  findOneByOptions(options: ChatReplyRepositoryFindOneByOptions): Promise<ChatReply>;

  findByOptions(options: ChatReplyRepositoryFindByOptions): Promise<ChatReply[]>;

  delete(chatReply: ChatReply): Promise<void>;
}
