import * as bcrypt from 'bcrypt';
import { Inject, UnauthorizedException } from '@nestjs/common';

import { config } from 'src/config/config';
import { UseCase } from 'src/shared/core/application/UseCase';
import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { IssueTokenUseCase } from '../IssueTokenUseCase/IssueTokenUseCase';
import { USER_REPOSITORY, UserRepository } from 'src/user/infrastructure/UserRepository';
import { SignInUseCaseRequest } from './dto/SignInUseCaseRequest';
import { SignInUseCaseResponse } from './dto/SignInUseCaseResponse';

export class SignInUseCase implements UseCase<SignInUseCaseRequest, SignInUseCaseResponse> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly issueTokenUseCase: IssueTokenUseCase,
  ) {}

  async execute(request: SignInUseCaseRequest): Promise<SignInUseCaseResponse> {
    const { email, password } = request;

    const user = await this.userRepository.findOneByOptions({ email: email });
    if (!user) {
      throw new UnauthorizedException('Invalid Email or Password');
    }

    const isPasswordValidate = await bcrypt.compare(password, user.password);
    if (!isPasswordValidate) {
      throw new UnauthorizedException('Invalid Email or Password');
    }

    const { token: accessToken } = await this.issueTokenUseCase.execute({
      userId: user.id,
      secretKey: config.JWT.ACCESS_KEY,
      expiredIn: config.JWT.ACCESS_KEY_EXPIRED_IN,
    });

    const { token: refreshToken } = await this.issueTokenUseCase.execute({
      userId: user.id,
      secretKey: config.JWT.REFRESH_KEY,
      expiredIn: config.JWT.REFRESH_KEY_EXPIRED_IN,
    });

    await this.userRepository.updateByOptions(user, { refreshToken: refreshToken });

    return {
      code: RESPONSE_CODE.SUCCESS,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
