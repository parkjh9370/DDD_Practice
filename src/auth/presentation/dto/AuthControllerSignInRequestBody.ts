import { ApiProperty } from '@nestjs/swagger';

export class AuthControllerSignInRequestBody {
  @ApiProperty({
    name: 'email',
    example: 'jhpark9370@naver.com',
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
}
