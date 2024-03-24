import { BadRequestException, Inject } from '@nestjs/common';

import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { UseCase } from 'src/shared/core/application/UseCase';
import { Chat } from 'src/chat/domain/Chat';
import { POST_REPOSITORY, PostRepository } from 'src/post/infrastructure/PostRepository';
import { CHAT_REPOSITORY, ChatRepository } from 'src/chat/infrastructure/ChatRepository';
import { CreateChatUseCaseRequest } from './dto/CreateChatUseCaseRequest';
import { CreateChatUseCaseResponse } from './dto/CreateChatUseCaseResponse';

export class CreateChatUseCase implements UseCase<CreateChatUseCaseRequest, CreateChatUseCaseResponse> {
  constructor(
    @Inject(CHAT_REPOSITORY) //
    private readonly chatRepository: ChatRepository,
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
  ) {}

  async execute(request: CreateChatUseCaseRequest): Promise<CreateChatUseCaseResponse> {
    const post = await this.postRepository.findOneByOptions({ id: request.postId });
    if (!post) {
      throw new BadRequestException('유효하지 못한 접근입니다.');
    }

    if (post.userIndex === request.userId && request.isAnonymous === true) {
      throw new BadRequestException('관리자 및 게시자는 익명 댓글을 작성할 수 없습니다.');
    }

    const chat = Chat.createNew({
      postIndex: request.postId,
      contents: request.contents,
      userIndex: request.userId,
      isAnonymous: request.isAnonymous,
      isUse: true,
    }).value;

    const insertedId = await this.chatRepository.save(chat);

    return { code: RESPONSE_CODE.SUCCESS, id: insertedId };
  }
}
