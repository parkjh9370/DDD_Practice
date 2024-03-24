import { BadRequestException, Inject } from '@nestjs/common';

import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { UseCase } from 'src/shared/core/application/UseCase';
import { SPACE_REPOSITORY, SpaceRepository } from 'src/space/infrastructure/SpaceRepository';
import { DeleteSpaceUseCaseRequest } from './dto/DeleteSpaceUseCaseRequest';
import { DeleteSpaceUseCaseResponse } from './dto/DeleteSpaceUseCaseResponse';

export class DeleteSpaceUseCase implements UseCase<DeleteSpaceUseCaseRequest, DeleteSpaceUseCaseResponse> {
  constructor(
    @Inject(SPACE_REPOSITORY)
    private readonly spaceRepository: SpaceRepository,
  ) {}

  async execute(request: DeleteSpaceUseCaseRequest): Promise<DeleteSpaceUseCaseResponse> {
    const { userId, spaceId } = request;

    const space = await this.spaceRepository.findOneByOptions({ id: spaceId });
    if (!space) {
      throw new BadRequestException('해당 Space는 존재하지 않습니다.');
    }

    const spaceUser = space.spaceUsers.filter((spaceUser) => spaceUser.userIndex === userId && spaceUser.spaceIndex === spaceId);
    if (spaceUser.length === 0) {
      throw new BadRequestException('유효하지 못한 접근입니다.');
    }

    if (spaceUser[0].hasAdministratorRights === false) {
      throw new BadRequestException('유효한 권한을 가지고 있지 않습니다.');
    }

    await this.spaceRepository.delete(space);

    return { code: RESPONSE_CODE.SUCCESS };
  }
}
