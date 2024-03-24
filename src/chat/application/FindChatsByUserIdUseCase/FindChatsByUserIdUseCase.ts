import { Inject } from '@nestjs/common';

import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { UseCase } from 'src/shared/core/application/UseCase';
import { CHAT_REPOSITORY, ChatRepository } from 'src/chat/infrastructure/ChatRepository';
import { POST_REPOSITORY, PostRepository } from 'src/post/infrastructure/PostRepository';
import { CHAT_REPLY_REPOSITORY, ChatReplyRepository } from 'src/chat/infrastructure/ChatReplyRepository';
import { FindChatsByUserIdUseCaseRequest } from './dto/FindChatsByUserIdUseCaseRequest';
import { FindChatsByUserIdUseCaseResponse } from './dto/FindChatsByUserIdUseCaseResponse';

export type UseChat = {
  post: {
    postId: number;
    name: string;
  };
  chats: Chat[];
  replies: Reply[];
};

type Chat = {
  chatId: number;
  contents: string;
};

type Reply = {
  replyId: number;
  contents: string;
};

export class FindChatsByUserIdUseCase implements UseCase<FindChatsByUserIdUseCaseRequest, FindChatsByUserIdUseCaseResponse> {
  constructor(
    @Inject(CHAT_REPOSITORY) //
    private readonly chatRepository: ChatRepository,
    @Inject(CHAT_REPLY_REPOSITORY)
    private readonly chatReplyRepository: ChatReplyRepository,
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
  ) {}

  async execute(request: FindChatsByUserIdUseCaseRequest): Promise<FindChatsByUserIdUseCaseResponse> {
    const chats = await this.chatRepository.findByOptions({ userId: request.userId });

    const useChats: UseChat[] = [];
    for (const chat of chats) {
      const postName = (await this.postRepository.findOneByOptions({ id: chat.postIndex })).name;

      const chats: Chat[] = [];
      const replies: Reply[] = [];
      if (chat.isUse) {
        chats.push({
          chatId: chat.id,
          contents: chat.contents,
        });
      }

      for (const reply of chat.chatReply) {
        if (reply.isUse) {
          replies.push({
            replyId: reply.id,
            contents: reply.contents,
          });
        }
      }

      if (chats.length > 0 || replies.length > 0) {
        const useChat: UseChat = {
          post: {
            postId: chat.postIndex,
            name: postName,
          },
          chats: chats,
          replies: replies,
        };

        useChats.push(useChat);
      }
    }

    const chatReplies = await this.chatReplyRepository.findByOptions({ userId: request.userId });
    for (const chatReply of chatReplies) {
      const postName = (await this.postRepository.findOneByOptions({ id: chatReply.postIndex })).name;

      const replies: Reply[] = [];
      if (chatReply.isUse) {
        replies.push({
          replyId: chatReply.id,
          contents: chatReply.contents,
        });
      }

      if (replies.length > 0) {
        const useChat: UseChat = {
          post: {
            postId: chatReply.postIndex,
            name: postName,
          },
          chats: [],
          replies: replies,
        };

        useChats.push(useChat);
      }
    }

    return { code: RESPONSE_CODE.SUCCESS, chats: useChats };
  }
}
