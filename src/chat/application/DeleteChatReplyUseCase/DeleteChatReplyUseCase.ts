import { BadRequestException, Inject } from '@nestjs/common';

import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { UseCase } from 'src/shared/core/application/UseCase';
import { CHAT_REPLY_REPOSITORY, ChatReplyRepository } from 'src/chat/infrastructure/ChatReplyRepository';
import { SPACE_REPOSITORY, SpaceRepository } from 'src/space/infrastructure/SpaceRepository';
import { DeleteChatReplyUseCaseRequest } from './dto/DeleteChatReplyUseCaseRequest';
import { DeleteChatReplyUseCaseResponse } from './dto/DeleteChatReplyUseCaseResponse';

export class DeleteChatReplyUseCase implements UseCase<DeleteChatReplyUseCaseRequest, DeleteChatReplyUseCaseResponse> {
  constructor(
    @Inject(CHAT_REPLY_REPOSITORY) //
    private readonly chatReplyRepository: ChatReplyRepository,
    @Inject(SPACE_REPOSITORY)
    private readonly spaceRepository: SpaceRepository,
  ) {}

  async execute(request: DeleteChatReplyUseCaseRequest): Promise<DeleteChatReplyUseCaseResponse> {
    const chatReply = await this.chatReplyRepository.findOneByOptions({ id: request.chatReplyId });
    if (!chatReply) {
      throw new BadRequestException('해당 Chat은 존재하지 않습니다.');
    }

    const space = await this.spaceRepository.findOneByOptions({ id: request.spaceId });
    if (!space) {
      throw new BadRequestException('해당 Space는 존재하지 않습니다.');
    }

    const spaceUser = space.spaceUsers.filter((spaceUser) => spaceUser.userIndex === request.userId);
    if (spaceUser.length === 0) {
      throw new BadRequestException('Space에 참여중인 유저가 아닙니다.');
    }

    const hasAdministratorRights = spaceUser[0].hasAdministratorRights;
    if (hasAdministratorRights) {
      await this.chatReplyRepository.delete(chatReply);

      return { code: RESPONSE_CODE.SUCCESS };
    }

    if (chatReply.userIndex !== request.userId) {
      throw new BadRequestException('다른 사람의 답글은 삭제할 수 없습니다.');
    }

    await this.chatReplyRepository.delete(chatReply);

    return { code: RESPONSE_CODE.SUCCESS };

    return { code: RESPONSE_CODE.SUCCESS };
  }
}
