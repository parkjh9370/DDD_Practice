import { v4 } from 'uuid';
import { Inject } from '@nestjs/common';

import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { UseCase } from 'src/shared/core/application/UseCase';
import { Space } from 'src/space/domain/Space';
import { SpaceRole } from 'src/space/domain/SpaceRole';
import { SpaceUser } from 'src/space/domain/SpaceUser';
import { SPACE_REPOSITORY, SpaceRepository } from 'src/space/infrastructure/SpaceRepository';
import { SPACE_ROLE_REPOSITORY, SpaceRoleRepository } from 'src/space/infrastructure/SpaceRoleRepository';
import { SPACE_USER_REPOSITORY, SpaceUserRepository } from 'src/space/infrastructure/SpaceUserRepository';
import { CreateSpaceUseCaseRequest } from './dto/CreateSpaceUseCaseRequest';
import { CreateSpaceUseCaseResponse } from './dto/CreateSpaceUseCaseResponse';

export class CreateSpaceUseCase implements UseCase<CreateSpaceUseCaseRequest, CreateSpaceUseCaseResponse> {
  constructor(
    @Inject(SPACE_REPOSITORY)
    private readonly spaceRepository: SpaceRepository,
    @Inject(SPACE_ROLE_REPOSITORY)
    private readonly spaceRoleRepository: SpaceRoleRepository,
    @Inject(SPACE_USER_REPOSITORY)
    private readonly spaceUserRepository: SpaceUserRepository,
  ) {}

  async execute(request: CreateSpaceUseCaseRequest): Promise<CreateSpaceUseCaseResponse> {
    const space = Space.createNew({
      name: request.name,
      logoImageUrl: request.logoImageUrl,
      accessCode: this.getRandomAccessCode(),
      adminAccessCode: this.getRandomAccessCode(),
      userIndex: request.userId,
      isUse: true,
    }).value;
    const spaceInsertedId = await this.spaceRepository.save(space);

    const createUserSpaceRole = SpaceRole.createNew({
      spaceIndex: spaceInsertedId,
      role: 'ADMIN',
      hasAdministratorRights: true,
      isUse: true,
    }).value;
    await this.spaceRoleRepository.save(createUserSpaceRole);

    for (const _spaceRole of request.roles) {
      const spaceRole = SpaceRole.createNew({
        spaceIndex: spaceInsertedId,
        role: _spaceRole.role,
        hasAdministratorRights: _spaceRole.hasAdministratorRights === true ? true : false,
        isUse: true,
      }).value;

      await this.spaceRoleRepository.save(spaceRole);
    }

    const spaceUser = SpaceUser.createNew({
      spaceIndex: spaceInsertedId,
      userIndex: request.userId,
      role: 'ADMIN',
      hasAdministratorRights: true,
      isCreateSpaceUser: true,
      isParticipating: true,
    }).value;
    await this.spaceUserRepository.save(spaceUser);

    return { code: RESPONSE_CODE.SUCCESS, id: spaceInsertedId };
  }

  private getRandomAccessCode() {
    return v4().slice(0, 8);
  }
}
