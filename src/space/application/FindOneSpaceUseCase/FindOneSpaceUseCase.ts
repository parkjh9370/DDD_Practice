import { BadRequestException, Inject } from '@nestjs/common';

import { UseCase } from 'src/shared/core/application/UseCase';
import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { SPACE_REPOSITORY, SpaceRepository } from 'src/space/infrastructure/SpaceRepository';
import { FindOneSpaceUseCaseRequest } from './dto/FindOneSpaceUseCaseRequest';
import { FindOneSpaceUseCaseResponse } from './dto/FindOneSpaceUseCaseResponse';

export class FindOneSpaceUseCase implements UseCase<FindOneSpaceUseCaseRequest, FindOneSpaceUseCaseResponse> {
  constructor(
    @Inject(SPACE_REPOSITORY)
    private readonly spaceRepository: SpaceRepository,
  ) {}

  async execute(request: FindOneSpaceUseCaseRequest): Promise<FindOneSpaceUseCaseResponse> {
    const space = await this.spaceRepository.findOneByOptions({ id: request.id });
    if (!space) {
      throw new BadRequestException('등록되지 않았거나 삭제된 공간입니다.');
    }

    return { code: RESPONSE_CODE.SUCCESS, space: space };
  }
}
