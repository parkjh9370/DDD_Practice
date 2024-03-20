import { ApiProperty } from '@nestjs/swagger';

import { ControllerResponse } from 'src/shared/core/presentation/ControllerResponse';
import { PostType } from 'src/post/domain/Post';

class UserControllerGetChatListPostBody {
  @ApiProperty({
    name: 'postId',
    example: 3,
    description: 'Post Id',
  })
  postId: number;

  @ApiProperty({
    name: 'name',
    example: '질문 있습니다!',
    description: 'Post 이름',
  })
  name: number;
}

class UserControllerGetChatListChatBody {
  @ApiProperty({
    name: 'chatId',
    example: 3,
    description: 'Chat Id',
  })
  chatId: number;

  @ApiProperty({
    name: 'name',
    example: '추가 내용 기재 드립니다. ~~~',
    description: 'Chat 내용',
  })
  contents: number;
}

class UserControllerGetChatListReplyBody {
  @ApiProperty({
    name: 'replyId',
    example: 3,
    description: 'Post Id',
  })
  replyId: number;

  @ApiProperty({
    name: 'contents',
    example: '아 그렇나요? 제가 잘못 봤네요.',
    description: 'Reply 내용',
  })
  contents: number;
}

class UserControllerGetChatListResponseBody {
  @ApiProperty({
    name: 'post',
    type: UserControllerGetChatListPostBody,
    description: 'Post 정보',
  })
  post: UserControllerGetChatListPostBody;

  @ApiProperty({
    name: 'name',
    type: UserControllerGetChatListChatBody,
    isArray: true,
    description: 'Chat 정보',
  })
  chats: string;

  @ApiProperty({
    name: 'type',
    type: UserControllerGetChatListReplyBody,
    isArray: true,
    description: 'Reply 정보',
  })
  replies: PostType;
}

export class UserControllerGetChatListResponse extends ControllerResponse {
  @ApiProperty({
    type: UserControllerGetChatListResponseBody,
    isArray: true,
    description: '참여중인 Chat 목록',
  })
  result: UserControllerGetChatListResponseBody[];
}
