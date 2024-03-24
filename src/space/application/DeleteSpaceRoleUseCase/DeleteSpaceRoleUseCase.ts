import { BadRequestException, Inject } from '@nestjs/common';

import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { UseCase } from 'src/shared/core/application/UseCase';
import { SPACE_REPOSITORY, SpaceRepository } from 'src/space/infrastructure/SpaceRepository';
import { SPACE_USER_REPOSITORY, SpaceUserRepository } from 'src/space/infrastructure/SpaceUserRepository';
import { SPACE_ROLE_REPOSITORY, SpaceRoleRepository } from 'src/space/infrastructure/SpaceRoleRepository';
import { DeleteSpaceRoleUseCaseRequest } from './dto/DeleteSpaceRoleUseCaseRequest';
import { DeleteSpaceRoleUseCaseResponse } from './dto/DeleteSpaceRoleUseCaseResponse';

export class DeleteSpaceRoleUseCase implements UseCase<DeleteSpaceRoleUseCaseRequest, DeleteSpaceRoleUseCaseResponse> {
  constructor(
    @Inject(SPACE_REPOSITORY)
    private readonly spaceRepository: SpaceRepository,
    @Inject(SPACE_USER_REPOSITORY)
    private readonly spaceUserRepository: SpaceUserRepository,
    @Inject(SPACE_ROLE_REPOSITORY)
    private readonly spaceRoleRepository: SpaceRoleRepository,
  ) {}

  async execute(request: DeleteSpaceRoleUseCaseRequest): Promise<DeleteSpaceRoleUseCaseResponse> {
    const { userId, spaceId, role } = request;

    if (role === 'ADMIN') {
      throw new BadRequestException('관리자 역할은 삭제할 수 없습니다.');
    }

    const space = await this.spaceRepository.findOneByOptions({ id: spaceId });
    if (!space) {
      throw new BadRequestException('해당 공간이 존재하지 않습니다.');
    }

    const spaceUser = await this.spaceUserRepository.findOneByOptions({ userId: userId, spaceId: spaceId });
    if (!spaceUser) {
      throw new BadRequestException('해당 유저는 Space에 참여하지 않았습니다.');
    }

    if (spaceUser.role !== 'ADMIN' || spaceUser.hasAdministratorRights !== true) {
      throw new BadRequestException('역할을 삭제할 수 있는 권한이 없습니다.');
    }

    const spaceRoles = await this.spaceRoleRepository.findByOptions({ spaceId: spaceId });
    if (spaceRoles.length === 0) {
      throw new BadRequestException('유효하지 못한 접근입니다.');
    }

    const matchedSpaceRole = spaceRoles.filter((spaceRole) => spaceRole.role === role);
    if (!matchedSpaceRole) {
      throw new BadRequestException('해당 역할은 존재하지 않습니다.');
    }

    const spaceUsers = await this.spaceUserRepository.findByOptions({ spaceId: spaceId });
    const useSpaceRoles = spaceUsers.map((spaceUser) => spaceUser.role);

    const isUserUseSpaceRole = useSpaceRoles.filter((spaceRole) => spaceRole === role);
    if (isUserUseSpaceRole.length > 0) {
      throw new BadRequestException('유저가 사용중인 역할은 삭제할 수 없습니다.');
    }

    const toDeleteSpaceRole = spaceRoles.filter((spaceRole) => spaceRole.role === role);
    if (!toDeleteSpaceRole) {
      throw new BadRequestException('해당 역할이 존재하지 않습니다.');
    }

    await this.spaceRoleRepository.delete(toDeleteSpaceRole[0]);

    return { code: RESPONSE_CODE.SUCCESS };
  }
}
