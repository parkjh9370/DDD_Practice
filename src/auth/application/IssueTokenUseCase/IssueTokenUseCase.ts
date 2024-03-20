import { JwtService } from '@nestjs/jwt';
import { Injectable, Scope } from '@nestjs/common';

import { UseCase } from 'src/shared/core/application/UseCase';
import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { IssueTokenUseCaseRequest } from './dto/IssueTokenUseCaseRequest';
import { IssueTokenUseCaseResponse } from './dto/IssueTokenUseCaseResponse';

@Injectable({ scope: Scope.DEFAULT })
export class IssueTokenUseCase implements UseCase<IssueTokenUseCaseRequest, IssueTokenUseCaseResponse> {
  constructor(
    private jwtService: JwtService, //
  ) {}

  async execute(request: IssueTokenUseCaseRequest): Promise<IssueTokenUseCaseResponse> {
    const { userId, secretKey, expiredIn } = request;

    const issuedToken = this.jwtService.sign(
      {
        sub: userId,
      },
      {
        secret: secretKey,
        expiresIn: expiredIn,
      },
    );

    return {
      code: RESPONSE_CODE.SUCCESS,
      token: issuedToken,
    };
  }
}
