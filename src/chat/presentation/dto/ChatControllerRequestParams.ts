import { ApiProperty } from '@nestjs/swagger';

export class ChatControllerRequestParams {
  @ApiProperty({
    name: 'id',
    example: '2',
    required: true,
    description: 'chat Id',
  })
  id: string;

  @ApiProperty({
    name: 'chatReplyId',
    example: '2',
    required: true,
    description: 'post Id',
  })
  replyId: string;

  @ApiProperty({
    name: 'postId',
    example: '2',
    required: true,
    description: 'post Id',
  })
  postId: string;

  @ApiProperty({
    name: 'spaceId',
    example: '2',
    required: true,
    description: 'space Id',
  })
  spaceId: string;
}
