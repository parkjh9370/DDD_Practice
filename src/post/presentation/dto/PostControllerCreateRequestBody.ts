import { ApiProperty } from '@nestjs/swagger';

import { PostType } from 'src/post/domain/Post';

export class PostControllerCreateRequestBody {
  @ApiProperty({
    name: 'name',
    example: '질문있습니다.',
    required: true,
    description: 'Post 이름',
  })
  name: string;

  @ApiProperty({
    name: 'type',
    example: 'QUESTION',
    required: true,
    description: 'Post 타입',
  })
  type: PostType;

  @ApiProperty({
    name: 'contents',
    example: '게시글에 욕설, 비방글 등 부적절한 언어가 포함되어 있을 시 통보없이 삭제될 수 있습니다.',
    required: true,
    description: 'Post 내용',
  })
  contents: string;

  @ApiProperty({
    name: 'isAnonymous',
    example: true,
    required: true,
    description: 'Post 익명 여부',
  })
  isAnonymous: boolean;

  @ApiProperty({
    name: 'fileUrls',
    example: [
      {
        url: 'https://files-dev.s3.ap-northeast-2.amazonaws.com/b138133b-9c55-47fc-a11c-0a04b949d4af.jpeg',
      },
      {
        url: 'https://files-dev.s3.ap-northeast-2.amazonaws.com/b138133b-9c55-47fc-a11c-0a04b949d4af.jpeg',
      },
    ],
    required: true,
    description: '업로드 파일 URLs',
  })
  fileUrls:
    | {
        url: string;
      }[]
    | null;
}
