import * as bcrypt from 'bcrypt';
import { BadRequestException, Inject } from '@nestjs/common';

import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { UseCase } from 'src/shared/core/application/UseCase';
import { User } from 'src/user/domain/User';
import { USER_REPOSITORY, UserRepository } from 'src/user/infrastructure/UserRepository';
import { CreateUserUseCaseRequest } from './dto/CreateUserUseCaseRequest';
import { CreateUserUseCaseResponse } from './dto/CreateUserUseCaseResponse';

export class CreateUserUseCase implements UseCase<CreateUserUseCaseRequest, CreateUserUseCaseResponse> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const user = User.createNew({
      email: request.email,
      password: request.password,
      lastName: request.lastName,
      firstName: request.firstName,
      profileImageUrl: request.profileImageUrl,
      isAdmin: request.isAdminUser ? true : false,
      isUse: true,
    }).value;

    const isSameEmailUserExist = await this.userRepository.findOneByOptions({ email: user.email });
    if (isSameEmailUserExist) {
      throw new BadRequestException('이미 등록된 이메일 입니다.');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const insertedUserId = await this.userRepository.save(user, hashedPassword);

    return { code: RESPONSE_CODE.SUCCESS, id: insertedUserId };
  }
}
