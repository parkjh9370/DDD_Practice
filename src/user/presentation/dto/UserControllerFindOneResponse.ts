import { ApiProperty } from '@nestjs/swagger';

import { ControllerResponse } from 'src/shared/core/presentation/ControllerResponse';

export class UserControllerFindOneResponseBody extends ControllerResponse {
  @ApiProperty({
    name: 'name',
    example: '박재현',
    description: '유저 풀네임',
  })
  name: string;

  @ApiProperty({
    name: 'lastName',
    example: '박',
    description: '유저 성',
  })
  lastName: string;

  @ApiProperty({
    name: 'firstName',
    example: '재현',
    description: '유저 이름',
  })
  firstName: string;

  @ApiProperty({
    name: 'profileImageUrl',
    example: 'https://files-dev.s3.ap-northeast-2.amazonaws.com/b138133b-9c55-47fc-a11c-0a04b949d4af.png',
    description: '프로필 이미지 URL',
  })
  profileImageUrl: string;
}

export class UserControllerFindOneResponse extends ControllerResponse {
  @ApiProperty({
    type: UserControllerFindOneResponseBody,
    description: '유저 프로필 조회',
  })
  result: UserControllerFindOneResponseBody;
}
