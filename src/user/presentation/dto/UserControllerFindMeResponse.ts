import { ApiProperty } from '@nestjs/swagger';

import { ControllerResponse } from 'src/shared/core/presentation/ControllerResponse';

export class UserControllerFindMeResponse extends ControllerResponse {
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
    name: 'email',
    example: 'parkjh9370@naver.com',
    description: '이메일',
  })
  email: string;

  @ApiProperty({
    name: 'profileImageUrl',
    example: 'https://files-dev.s3.ap-northeast-2.amazonaws.com/b138133b-9c55-47fc-a11c-0a04b949d4af.jpeg',
    description: '프로필 이미지 URL',
  })
  profileImageUrl: string;
}
