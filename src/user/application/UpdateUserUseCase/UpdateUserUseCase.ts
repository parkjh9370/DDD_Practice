import { BadRequestException, Inject } from '@nestjs/common';

import { UseCase } from 'src/shared/core/application/UseCase';
import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { USER_REPOSITORY, UserRepository } from 'src/user/infrastructure/UserRepository';
import { UpdateUserUseCaseRequest } from './dto/UpdateUserUseCaseRequest';
import { UpdateUserUseCaseResponse } from './dto/UpdateUserUseCaseResponse';

export class UpdateUserUseCase implements UseCase<UpdateUserUseCaseRequest, UpdateUserUseCaseResponse> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const { id, lastName, firstName, profileImageUrl } = request;

    const user = await this.userRepository.findOneByOptions({ id: id });
    if (!user || user.isUse === false) {
      throw new BadRequestException('존재하지 않거나 삭제된 유저입니다.');
    }

    await this.userRepository.updateByOptions(user, {
      lastName,
      firstName,
      profileImageUrl,
    });

    return { code: RESPONSE_CODE.SUCCESS };
  }
}
