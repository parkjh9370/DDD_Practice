import { BadRequestException, Inject } from '@nestjs/common';

import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { UseCase } from 'src/shared/core/application/UseCase';
import { ChatReply } from 'src/chat/domain/ChatReply';
import { SPACE_USER_REPOSITORY, SpaceUserRepository } from 'src/space/infrastructure/SpaceUserRepository';
import { CHAT_REPOSITORY, ChatRepository } from 'src/chat/infrastructure/ChatRepository';
import { CHAT_REPLY_REPOSITORY, ChatReplyRepository } from 'src/chat/infrastructure/ChatReplyRepository';
import { POST_REPOSITORY, PostRepository } from 'src/post/infrastructure/PostRepository';
import { CreateChatReplyUseCaseRequest } from './dto/CreateChatReplyUseCaseRequest';
import { CreateChatReplyUseCaseResponse } from './dto/CreateChatReplyUseCaseResponse';

export class CreateChatReplyUseCase implements UseCase<CreateChatReplyUseCaseRequest, CreateChatReplyUseCaseResponse> {
  constructor(
    @Inject(SPACE_USER_REPOSITORY)
    private readonly spaceUserRepository: SpaceUserRepository,
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: ChatRepository,
    @Inject(CHAT_REPLY_REPOSITORY) //
    private readonly chatReplyRepository: ChatReplyRepository,
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
  ) {}

  async execute(request: CreateChatReplyUseCaseRequest): Promise<CreateChatReplyUseCaseResponse> {
    const post = await this.postRepository.findOneByOptions({ id: request.postId });
    if (!post) {
      throw new BadRequestException('해당 Post를 찾을 수 없습니다.');
    }

    if (post.userIndex === request.userId && request.isAnonymous === true) {
      throw new BadRequestException('Post 게시자는 익명 댓글을 작성할 수 없습니다.');
    }

    const spaceUser = await this.spaceUserRepository.findOneByOptions({ userId: request.userId });
    if (spaceUser.hasAdministratorRights === true && request.isAnonymous === true) {
      throw new BadRequestException('관리자는 익명 댓글을 작성할 수 없습니다.');
    }

    const chat = this.chatRepository.findOneByOptions({ id: request.chatId });
    if (!chat) {
      throw new BadRequestException('해당 Chat을 찾을 수 없습니다.');
    }

    const chatReply = ChatReply.createNew({
      chatIndex: request.chatId,
      contents: request.contents,
      userIndex: request.userId,
      postIndex: request.postId,
      isAnonymous: request.isAnonymous,
      isUse: true,
    }).value;

    const insertedId = await this.chatReplyRepository.save(chatReply);

    return { code: RESPONSE_CODE.SUCCESS, id: insertedId };
  }
}
