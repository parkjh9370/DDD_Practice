import { BadRequestException, Inject } from '@nestjs/common';

import { UseCase } from 'src/shared/core/application/UseCase';
import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { Space } from 'src/space/domain/Space';
import { SpaceUser } from 'src/space/domain/SpaceUser';
import { FindOneUserUseCase } from 'src/user/application/FindOneUserUseCase/FindOneUserUseCase';
import { SPACE_REPOSITORY, SpaceRepository } from 'src/space/infrastructure/SpaceRepository';
import { SPACE_USER_REPOSITORY, SpaceUserRepository } from 'src/space/infrastructure/SpaceUserRepository';
import { ParticipateInSpaceUseCaseRequest } from './dto/ParticipateInSpaceUseCaseRequest';
import { ParticipateInSpaceUseCaseResponse } from './dto/ParticipateInSpaceUseCaseResponse';

export class ParticipateInSpaceUseCase implements UseCase<ParticipateInSpaceUseCaseRequest, ParticipateInSpaceUseCaseResponse> {
  constructor(
    @Inject(SPACE_REPOSITORY)
    private readonly spaceRepository: SpaceRepository,
    @Inject(SPACE_USER_REPOSITORY)
    private readonly spaceUserRepository: SpaceUserRepository,
    private readonly findOneUserUseCase: FindOneUserUseCase,
  ) {}

  async execute(request: ParticipateInSpaceUseCaseRequest): Promise<ParticipateInSpaceUseCaseResponse> {
    const { userId, spaceId, accessCode, role } = request;

    const { user } = await this.findOneUserUseCase.execute({ id: userId });
    if (user.isAdmin === false && role === 'ADMIN') {
      throw new BadRequestException('관리자가 아닌 경우 관리자 역할로 참가할 수 없습니다.');
    }

    const space = await this.spaceRepository.findOneByOptions({ id: spaceId });
    if (!space) {
      throw new BadRequestException('유효하지 못한 접근입니다.');
    }

    await this.checkValidParticipatedInSpaceConditions(space, accessCode, role);

    const matchedSpaceRole = space.spaceRoles.filter((spaceRole) => spaceRole.role === role);
    if (matchedSpaceRole.length === 0) {
      throw new BadRequestException('유효하지 못한 역할입니다.');
    }

    const participatingSpaceUser = await this.spaceUserRepository.findOneByOptions({ userId: userId, spaceId: spaceId });
    if (participatingSpaceUser && participatingSpaceUser.role !== role) {
      throw new BadRequestException('이미 다른 역할로 참여한 유저 입니다.');
    }

    if (participatingSpaceUser) {
      await this.spaceUserRepository.updateIsParticipating(participatingSpaceUser, true);

      return { code: RESPONSE_CODE.SUCCESS };
    }

    const spaceUser = SpaceUser.createNew({
      spaceIndex: spaceId,
      userIndex: userId,
      role: role,
      hasAdministratorRights: matchedSpaceRole[0].hasAdministratorRights,
      isParticipating: true,
      isCreateSpaceUser: false,
    }).value;
    await this.spaceUserRepository.save(spaceUser);

    return { code: RESPONSE_CODE.SUCCESS };
  }

  private async checkValidParticipatedInSpaceConditions(space: Space, accessCode: string, role: string): Promise<void> {
    if (space.isUse === false) {
      throw new BadRequestException('유효하지 않은 접근 입니다.');
    }

    if (accessCode !== space.accessCode && accessCode !== space.adminAccessCode) {
      throw new BadRequestException('유효하지 않은 입장코드 입니다.');
    }

    const matchedSpaceRole = space.spaceRoles.filter((spaceRole) => spaceRole.role === role);
    if (matchedSpaceRole.length === 0) {
      throw new BadRequestException('등록되지 않은 역할 입니다.');
    }

    if (matchedSpaceRole[0].hasAdministratorRights === false && accessCode === space.adminAccessCode) {
      throw new BadRequestException('해당 역할은 관리자 코드로 참여할 수 없습니다.');
    }

    if (accessCode === space.accessCode && matchedSpaceRole[0].hasAdministratorRights === true) {
      throw new BadRequestException('관리 권한이 없는 접근 코드 입니다.');
    }
  }
}
