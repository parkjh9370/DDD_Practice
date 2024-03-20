import { ApiProperty } from '@nestjs/swagger';

import { ControllerResponse } from 'src/shared/core/presentation/ControllerResponse';

class UserControllerGetParticipatingSpaceListResponseBody {
  @ApiProperty({
    name: 'spaceId',
    example: 3,
    description: 'Space Id',
  })
  spaceId: number;

  @ApiProperty({
    name: 'name',
    example: '세계화와 역사.',
    description: 'Space name',
  })
  name: string;

  @ApiProperty({
    name: 'logoImageUrl',
    example: 'https://files-dev.s3.amazonaws.com/16410ddd-cc4e-476d-aabb-6004fe8e92d9.png',
    description: 'Space 로고 이미지 Url',
  })
  logoImageUrl: string;
}

export class UserControllerGetParticipatingSpaceListResponse extends ControllerResponse {
  @ApiProperty({
    isArray: true,
    type: UserControllerGetParticipatingSpaceListResponseBody,
    description: '참여중인 Post 목록',
  })
  result: UserControllerGetParticipatingSpaceListResponseBody[];
}
