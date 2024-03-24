import { BadRequestException, Inject } from '@nestjs/common';

import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { UseCase } from 'src/shared/core/application/UseCase';
import { SPACE_REPOSITORY, SpaceRepository } from 'src/space/infrastructure/SpaceRepository';
import { CHAT_REPOSITORY, ChatRepository } from 'src/chat/infrastructure/ChatRepository';
import { DeleteChatUseCaseRequest } from './dto/DeleteChatUseCaseRequest';
import { DeleteChatUseCaseResponse } from './dto/DeleteChatUseCaseResponse';

export class DeleteChatUseCase implements UseCase<DeleteChatUseCaseRequest, DeleteChatUseCaseResponse> {
  constructor(
    @Inject(CHAT_REPOSITORY) //
    private readonly chatRepository: ChatRepository,
    @Inject(SPACE_REPOSITORY)
    private readonly spaceRepository: SpaceRepository,
  ) {}

  async execute(request: DeleteChatUseCaseRequest): Promise<DeleteChatUseCaseResponse> {
    const chat = await this.chatRepository.findOneByOptions({ id: request.chatId });
    if (!chat) {
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
      await this.chatRepository.delete(chat);

      return { code: RESPONSE_CODE.SUCCESS };
    }

    if (chat.userIndex !== request.userId) {
      throw new BadRequestException('다른 사람의 댓글은 삭제할 수 없습니다.');
    }

    await this.chatRepository.delete(chat);

    return { code: RESPONSE_CODE.SUCCESS };
  }
}
