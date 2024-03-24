import { ApiProperty } from '@nestjs/swagger';
import { PostType } from 'src/post/domain/Post';
import { ControllerResponse } from 'src/shared/core/presentation/ControllerResponse';

class SpaceControllerGetPostsResponseBody {
  @ApiProperty({
    name: 'userId',
    example: 3,
    description: '유저 Id',
  })
  userId: number | null;

  @ApiProperty({
    name: 'userName',
    example: '안해수',
    description: '유저 이름',
  })
  userName: number | null;

  @ApiProperty({
    name: 'name',
    example: '3장 1강 중 궁금한 부분이 있습니다.',
    description: 'Post 이름',
  })
  name: string;

  @ApiProperty({
    name: 'type',
    example: 'QUESTION',
    description: 'Post 타입',
  })
  type: PostType;

  @ApiProperty({
    name: 'isAnonymous',
    example: true,
    description: 'Post 익명 여부',
  })
  isAnonymous: boolean;

  @ApiProperty({
    name: 'isCreateUser',
    example: true,
    description: 'Post 생성자 여부',
  })
  isCreateUser: boolean;
}

export class SpaceControllerGetPostsResponse extends ControllerResponse {
  @ApiProperty({
    isArray: true,
    type: SpaceControllerGetPostsResponseBody,
    description: '포스트 정보',
  })
  result: SpaceControllerGetPostsResponseBody[];
}
