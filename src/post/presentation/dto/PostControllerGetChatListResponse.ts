import { ApiProperty } from '@nestjs/swagger';

import { ControllerResponse } from 'src/shared/core/presentation/ControllerResponse';

class PostControllerGetChatListResponseBodyChat {
  @ApiProperty({
    name: 'userId',
    example: 3,
    description: 'User Id',
  })
  userId: number;

  @ApiProperty({
    name: 'userName',
    example: '박재현',
    description: 'User (+ 성)이름',
  })
  userName: number;

  @ApiProperty({
    name: 'contents',
    example: '감사합니다!',
    description: 'Chat 내용',
  })
  contents: string;

  @ApiProperty({
    name: 'isCreateUser',
    example: true,
    description: '작성자 여부',
  })
  isCreateUser: boolean;

  @ApiProperty({
    name: 'isAnonymous',
    example: true,
    description: '익명 여부',
  })
  isAnonymous: boolean;
}

class PostControllerGetChatListResponseBodyReply {
  @ApiProperty({
    name: 'userId',
    example: 3,
    description: 'User Id',
  })
  userId: number;

  @ApiProperty({
    name: 'userName',
    example: '박재현',
    description: 'User (+ 성)이름',
  })
  userName: number;

  @ApiProperty({
    name: 'contents',
    example: '감사합니다!',
    description: 'Chat 내용',
  })
  contents: string;

  @ApiProperty({
    name: 'isCreateUser',
    example: true,
    description: '작성자 여부',
  })
  isCreateUser: boolean;

  @ApiProperty({
    name: 'isAnonymous',
    example: true,
    description: '익명 여부',
  })
  isAnonymous: boolean;
}

class PostControllerGetChatListResponseBody {
  @ApiProperty({
    name: 'chat',
    type: PostControllerGetChatListResponseBodyChat,
    description: 'Chat 정보',
  })
  chat: PostControllerGetChatListResponseBodyChat;

  @ApiProperty({
    name: 'type',
    type: PostControllerGetChatListResponseBodyReply,
    isArray: true,
    description: 'Reply 정보',
  })
  replies: PostControllerGetChatListResponseBodyReply[];
}

export class PostControllerGetChatListResponse extends ControllerResponse {
  @ApiProperty({
    type: PostControllerGetChatListResponseBody,
    isArray: true,
    description: 'Chat 리스트',
  })
  result: PostControllerGetChatListResponseBody[];
}
