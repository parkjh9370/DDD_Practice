import { ApiProperty } from '@nestjs/swagger';

import { ControllerResponse } from 'src/shared/core/presentation/ControllerResponse';

export class AuthControllerReIssuanceTokenResponseBody {
  @ApiProperty({
    name: 'userId',
    example: 3,
    description: 'user Id',
  })
  userId: number;

  @ApiProperty({
    name: 'accessToken',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE2OTUxNDQ1NDMsIm',
    description: '인증 토큰',
  })
  accessToken: string;
}

export class AuthControllerReIssuanceTokenResponse extends ControllerResponse {
  @ApiProperty({
    type: AuthControllerReIssuanceTokenResponseBody,
    description: '토근 재발급',
  })
  result: AuthControllerReIssuanceTokenResponseBody;
}
