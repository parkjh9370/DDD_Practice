import { BadRequestException, Inject } from '@nestjs/common';

import { UseCase } from 'src/shared/core/application/UseCase';
import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { Space } from 'src/space/domain/Space';
import { USER_REPOSITORY, UserRepository } from 'src/user/infrastructure/UserRepository';
import { FindOneSpaceUseCase } from 'src/space/application/FindOneSpaceUseCase/FindOneSpaceUseCase';
import { FindParticipatingSpaceListUseCaseRequest } from './dto/FindParticipatingSpaceListUseCaseRequest';
import { FindParticipatingSpaceListUseCaseResponse } from './dto/FindParticipatingSpaceListUseCaseResponse';

export class FindParticipatingSpaceListUseCase implements UseCase<FindParticipatingSpaceListUseCaseRequest, FindParticipatingSpaceListUseCaseResponse> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly findOneSpaceUseCase: FindOneSpaceUseCase,
  ) {}

  async execute(request: FindParticipatingSpaceListUseCaseRequest): Promise<FindParticipatingSpaceListUseCaseResponse> {
    const user = await this.userRepository.findOneByOptions({ id: request.id });
    if (!user || user.isUse === false) {
      throw new BadRequestException('등록되지 않았거나 탈퇴한 유저입니다.');
    }

    const userParticipatingSpaces = user.spaceUsers.filter((spaceUser) => spaceUser.isParticipating === true);
    if (userParticipatingSpaces.length === 0) {
      return { code: RESPONSE_CODE.SUCCESS, spaces: [] };
    }

    const spaces: Space[] = [];
    for (const userSpace of userParticipatingSpaces) {
      const { space } = await this.findOneSpaceUseCase.execute({ id: userSpace.spaceIndex });
      if (space.isUse === false) {
        continue;
      }

      spaces.push(space);
    }

    return { code: RESPONSE_CODE.SUCCESS, spaces: spaces };
  }
}
