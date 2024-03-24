import { ApiProperty } from '@nestjs/swagger';

import { ControllerResponse } from 'src/shared/core/presentation/ControllerResponse';

class SpaceControllerCreateResponseBodyResult {
  @ApiProperty({
    description: '생성된 p_space 관리번호',
    example: 1,
  })
  id: number;
}

export class SpaceControllerCreateResponse extends ControllerResponse {
  @ApiProperty({
    required: true,
    description: 'result',
    example: SpaceControllerCreateResponseBodyResult,
  })
  result: SpaceControllerCreateResponseBodyResult;
}
