import { ApiProperty } from '@nestjs/swagger';

import { ControllerResponse } from 'src/shared/core/presentation/ControllerResponse';
import { PostType } from 'src/post/domain/Post';

class UserControllerGetPostListResponseResponseBodySpace {
  @ApiProperty({
    name: 'spaceId',
    example: 1,
    description: 'Space Id',
  })
  spaceId: number;

  @ApiProperty({
    name: 'contents',
    example: '세계화의 역사',
    description: 'Space 이름',
  })
  contents: number;

  @ApiProperty({
    name: 'isUse',
    example: true,
    description: 'Space 삭제여부',
  })
  isUse: string;
}

class UserControllerGetPostListResponseResponseBodyPost {
  @ApiProperty({
    name: 'postId',
    example: 1,
    description: 'Post Id',
  })
  postId: number;

  @ApiProperty({
    name: 'name',
    example: '세계화의 역사 공지글',
    description: 'Post 이름',
  })
  name: string;

  @ApiProperty({
    name: 'name',
    example: '세계화의 역사 공지글',
    description: 'Post 이름',
  })
  type: PostType;

  @ApiProperty({
    name: 'contents',
    example: '게시글에 욕설, 비방글 등 부적절한 언어가 포함되어 있을 시 통보없이 삭제될 수 있습니다.',
    description: 'Space 로고 이미지 URL',
  })
  contents: string;
}

class UserControllerGetPostListResponseResponseBody {
  @ApiProperty({
    name: 'space',
    description: '참여중인 Space 정보',
  })
  space: UserControllerGetPostListResponseResponseBodySpace;

  @ApiProperty({
    name: 'name',
    isArray: true,
    type: UserControllerGetPostListResponseResponseBodyPost,
    description: 'Post 리스트',
  })
  posts: UserControllerGetPostListResponseResponseBodyPost[];
}

export class UserControllerGetPostListResponse extends ControllerResponse {
  @ApiProperty({
    isArray: true,
    type: UserControllerGetPostListResponseResponseBody,
    description: '참여중인 Post 목록',
  })
  result: UserControllerGetPostListResponseResponseBody[];
}
