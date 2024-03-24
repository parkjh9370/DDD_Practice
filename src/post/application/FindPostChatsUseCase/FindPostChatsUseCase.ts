import { BadRequestException, Inject } from '@nestjs/common';

import { UseCase } from 'src/shared/core/application/UseCase';
import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { SPACE_REPOSITORY, SpaceRepository } from 'src/space/infrastructure/SpaceRepository';
import { CHAT_REPOSITORY, ChatRepository } from 'src/chat/infrastructure/ChatRepository';
import { USER_REPOSITORY, UserRepository } from 'src/user/infrastructure/UserRepository';
import { FindPostChatsUseCaseRequest } from './dto/FindPostChatsUseCaseRequest';
import { FindPostChatsUseCaseResponse } from './dto/FindPostChatsUseCaseResponse';

export type PostChat = {
  chat: {
    userId: number | null;
    userName: string | null;
    contents: string;
    isCreateUser: boolean;
    isAnonymous: boolean;
  } | null;
  reply: PostChatReply[];
};

type PostChatReply = {
  userId: number | null;
  userName: string | null;
  contents: string;
  isCreateUser: boolean;
  isAnonymous: boolean;
} | null;

export class FindPostChatsUseCase implements UseCase<FindPostChatsUseCaseRequest, FindPostChatsUseCaseResponse> {
  constructor(
    @Inject(SPACE_REPOSITORY)
    private readonly spaceRepository: SpaceRepository,
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: ChatRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: FindPostChatsUseCaseRequest): Promise<FindPostChatsUseCaseResponse> {
    const chats = await this.chatRepository.findByOptions({ postId: request.id });

    const space = await this.spaceRepository.findOneByOptions({ id: request.spaceId });
    if (!space) {
      throw new BadRequestException('유효하지 못한 접근입니다.');
    }

    const spaceUser = space.spaceUsers.filter((spaceUser) => spaceUser.userIndex === request.userId)[0];
    if (!spaceUser) {
      throw new BadRequestException('유효하지 못한 접근입니다.');
    }

    const hasAdministratorRights = spaceUser.hasAdministratorRights;

    const postChats: PostChat[] = [];
    for (const chat of chats) {
      const isCreateChatUser = chat.userIndex === request.userId;

      const isCanViewAnonymousContentsUser = hasAdministratorRights || isCreateChatUser;

      const postChat: PostChat = {
        chat:
          chat.isUse === true
            ? {
                userId: isCanViewAnonymousContentsUser || !chat.isAnonymous ? chat.userIndex : null,
                userName: isCanViewAnonymousContentsUser || !chat.isAnonymous ? (await this.userRepository.findOneByOptions({ id: chat.userIndex })).fullName : null,
                contents: chat.contents,
                isCreateUser: isCreateChatUser,
                isAnonymous: chat.isAnonymous,
              }
            : null,
        reply: [],
      };

      for (const reply of chat.chatReply) {
        if (!reply.isUse) {
          continue;
        }

        const isCreateChatReplyUser = reply.userIndex === request.userId;

        const isViewAnonymousContentsUser = hasAdministratorRights || isCreateChatReplyUser;

        const postChatReply: PostChatReply = {
          userId: isViewAnonymousContentsUser || !reply.isAnonymous ? reply.userIndex : null,
          userName: isViewAnonymousContentsUser || !reply.isAnonymous ? (await this.userRepository.findOneByOptions({ id: reply.userIndex })).fullName : null,
          contents: reply.contents,
          isCreateUser: isCreateChatReplyUser,
          isAnonymous: reply.isAnonymous,
        };

        postChat.reply.push(postChatReply);
      }

      postChats.push(postChat);
    }

    return { code: RESPONSE_CODE.SUCCESS, postChats: postChats };
  }
}
