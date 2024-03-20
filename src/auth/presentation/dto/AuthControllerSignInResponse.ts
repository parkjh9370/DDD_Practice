import { ApiProperty } from '@nestjs/swagger';

import { ControllerResponse } from 'src/shared/core/presentation/ControllerResponse';

export class AuthControllerSignInResponseBody {
  @ApiProperty({
    name: 'accessToken',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE2OTUxNDQ1NDMsIm',
    description: '인증 토큰',
  })
  accessToken: string;
}

export class UserControllerSignInResponse extends ControllerResponse {
  @ApiProperty({
    type: AuthControllerSignInResponseBody,
    description: '회원가입',
  })
  result: AuthControllerSignInResponseBody;
}
