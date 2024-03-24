import { ApiProperty } from '@nestjs/swagger';

export class ChatControllerCreateRequestBody {
  @ApiProperty({
    name: 'contents',
    example: '좋은 정보 감사드립니다.',
    required: true,
    description: '내용',
  })
  contents: string;

  @ApiProperty({
    name: 'isAnonymous',
    example: true,
    required: true,
    description: '익명 작성 여부',
  })
  isAnonymous: boolean;
}
