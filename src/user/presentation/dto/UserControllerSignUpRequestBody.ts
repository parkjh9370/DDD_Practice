import { ApiProperty } from '@nestjs/swagger';

export class UserControllerSignUpRequestBody {
  @ApiProperty({
    name: 'email',
    example: 'jhpark9370@gmail.com',
    required: true,
    description: '이메일',
  })
  email: string;

  @ApiProperty({
    name: 'password',
    example: '1124passe3!@#',
    required: true,
    description: '비밀번호',
  })
  password: string;

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
    example: 'https://files-dev.s3.ap-northeast-2.amazonaws.com/b138133b-9c55-47fc-a11c-0a04b949d4af.png',
    required: false,
    description: '프로필 이미지 URL',
  })
  profileImageUrl?: string;

  @ApiProperty({
    name: 'isAdminUser',
    example: true,
    required: false,
    description: '관리자 여부',
  })
  isAdminUser?: boolean;
}
