import { BadRequestException, Inject } from '@nestjs/common';

import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { UseCase } from 'src/shared/core/application/UseCase';
import { SPACE_REPOSITORY, SpaceRepository } from 'src/space/infrastructure/SpaceRepository';
import { SPACE_USER_REPOSITORY, SpaceUserRepository } from 'src/space/infrastructure/SpaceUserRepository';
import { UpdateSpaceUserRightsUseCaseRequest } from './dto/UpdateSpaceUserRightsUseCaseRequest';
import { UpdateSpaceUserRightsUseCaseResponse } from './dto/UpdateSpaceUserRightsUseCaseResponse';

export class UpdateSpaceUserRightsUseCase implements UseCase<UpdateSpaceUserRightsUseCaseRequest, UpdateSpaceUserRightsUseCaseResponse> {
  constructor(
    @Inject(SPACE_USER_REPOSITORY)
    private readonly spaceUserRepository: SpaceUserRepository,
    @Inject(SPACE_REPOSITORY)
    private readonly spaceRepository: SpaceRepository,
  ) {}

  async execute(request: UpdateSpaceUserRightsUseCaseRequest): Promise<UpdateSpaceUserRightsUseCaseResponse> {
    const { spaceId, userId, rights, toUpdateUserId } = request;

    const space = await this.spaceRepository.findOneByOptions({ id: spaceId });
    if (!space) {
      throw new BadRequestException('생성된 Space가 존재하지 않습니다.');
    }

    const spaceUser = await this.spaceUserRepository.findOneByOptions({ userId: userId, spaceId: spaceId });
    if (!spaceUser) {
      throw new BadRequestException('해당 유저는 Space에 참여하지 않은 유저입니다.');
    }

    if (spaceUser.hasAdministratorRights === false) {
      throw new BadRequestException('해당 유저는 유효한 권한을 가지고 있지 않습니다.');
    }

    const toUpdateSpaceUser = await this.spaceUserRepository.findOneByOptions({ userId: toUpdateUserId, spaceId: spaceId });
    if (!toUpdateSpaceUser) {
      throw new BadRequestException('권한을 부여해 줄 유저가 Space에 참여하지 않았습니다.');
    }

    await this.spaceUserRepository.updateAdministratorRights(toUpdateSpaceUser, rights);

    return { code: RESPONSE_CODE.SUCCESS };
  }
}
