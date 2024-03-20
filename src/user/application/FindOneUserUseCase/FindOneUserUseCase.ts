import { BadRequestException, Inject } from '@nestjs/common';

import { UseCase } from 'src/shared/core/application/UseCase';
import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { USER_REPOSITORY, UserRepository } from 'src/user/infrastructure/UserRepository';
import { FindOneUserUseCaseResponse } from './dto/FindOneUserUseCaseResponse';
import { FindOneUserUseCaseRequest } from './dto/FindOneUserUseCaseRequest';

export class FindOneUserUseCase implements UseCase<FindOneUserUseCaseRequest, FindOneUserUseCaseResponse> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: FindOneUserUseCaseRequest): Promise<FindOneUserUseCaseResponse> {
    const user = await this.userRepository.findOneByOptions({ id: request.id });
    if (!user || user.isUse === false) {
      throw new BadRequestException('등록되지 않았거나 탈퇴한 유저입니다.');
    }

    return { code: RESPONSE_CODE.SUCCESS, user: user };
  }
}
