import { ApiProperty } from '@nestjs/swagger';

import { ControllerResponse } from 'src/shared/core/presentation/ControllerResponse';

class UserControllerSignUpResponseBodyResult {
  @ApiProperty({
    description: '생성된 p_user 관리번호',
    example: 1,
  })
  id: number;
}

export class UserControllerSignUpResponse extends ControllerResponse {
  @ApiProperty({
    required: true,
    description: 'result',
    example: UserControllerSignUpResponseBodyResult,
  })
  result: UserControllerSignUpResponseBodyResult;
}
