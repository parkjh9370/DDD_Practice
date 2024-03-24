import { ApiProperty } from '@nestjs/swagger';

import { ControllerResponse } from 'src/shared/core/presentation/ControllerResponse';

class PostControllerCreateResponseBodyResult {
  @ApiProperty({
    description: '생성된 p_post 관리번호',
    example: 1,
  })
  id: number;
}

export class PostControllerCreateResponse extends ControllerResponse {
  @ApiProperty({
    required: true,
    description: 'result',
    example: PostControllerCreateResponseBodyResult,
  })
  result: PostControllerCreateResponseBodyResult;
}
