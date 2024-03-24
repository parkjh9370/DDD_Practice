import { BadRequestException, Inject } from '@nestjs/common';

import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { UseCase } from 'src/shared/core/application/UseCase';
import { SpaceUser } from 'src/space/domain/SpaceUser';
import { SPACE_REPOSITORY, SpaceRepository } from 'src/space/infrastructure/SpaceRepository';
import { SPACE_USER_REPOSITORY, SpaceUserRepository } from 'src/space/infrastructure/SpaceUserRepository';
import { UpdateSpaceCreateUserUseCaseRequest } from './dto/UpdateSpaceCreateUserUseCaseRequest';
import { UpdateSpaceCreateUserUseCaseResponse } from './dto/UpdateSpaceCreateUserUseCaseResponse';

export class UpdateSpaceCreateUserUseCase implements UseCase<UpdateSpaceCreateUserUseCaseRequest, UpdateSpaceCreateUserUseCaseResponse> {
  constructor(
    @Inject(SPACE_REPOSITORY)
    private readonly spaceRepository: SpaceRepository,
    @Inject(SPACE_USER_REPOSITORY)
    private readonly spaceUserRepository: SpaceUserRepository,
  ) {}

  async execute(request: UpdateSpaceCreateUserUseCaseRequest): Promise<UpdateSpaceCreateUserUseCaseResponse> {
    const { userId, spaceId, toUpdateUserId } = request;

    const space = await this.spaceRepository.findOneByOptions({ id: spaceId });
    if (!space) {
      throw new BadRequestException('생성된 Space가 존재하지 않습니다.');
    }

    const spaceUser = await this.spaceUserRepository.findOneByOptions({ userId: userId, spaceId: spaceId });
    if (!spaceUser) {
      throw new BadRequestException('해당 유저는 Space에 참여하지 않은 유저입니다.');
    }

    if (spaceUser.isCreateSpaceUser === false || spaceUser.role !== 'ADMIN') {
      throw new BadRequestException('해당 유저는 유효한 권한을 가지고 있지 않습니다.');
    }

    const toUpdateSpaceUser = await this.spaceUserRepository.findOneByOptions({ userId: toUpdateUserId, spaceId: spaceId });
    if (!toUpdateSpaceUser) {
      throw new BadRequestException('소유자로 임명할 유저가 Space에 참여하지 않았습니다.');
    }

    const toUpdateUser = SpaceUser.create(
      {
        spaceIndex: spaceId,
        userIndex: toUpdateUserId,
        role: 'ADMIN',
        hasAdministratorRights: true,
        isParticipating: true,
        isCreateSpaceUser: true,
      },
      toUpdateSpaceUser.id,
    ).value;

    await this.spaceUserRepository.update(toUpdateUser);

    return { code: RESPONSE_CODE.SUCCESS };
  }
}
