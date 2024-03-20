import { ApiProperty } from '@nestjs/swagger';

export class UserControllerUpdateRequestBody {
  @ApiProperty({
    name: 'lastName',
    example: '박',
    required: true,
    description: '성',
  })
  lastName: string;

  @ApiProperty({
    name: 'firstName',
    example: '재현',
    required: true,
    description: '이름',
  })
  firstName: string;

  @ApiProperty({
    name: 'profileImageUrl',
    example: 'https://files-dev.s3.ap-northeast-2.amazonaws.com/b138133b-9c55-47fc-a11c-0a04b949d4af.jpeg',
    description: '프로필 이미지 URL',
  })
  profileImageUrl: string;
}
