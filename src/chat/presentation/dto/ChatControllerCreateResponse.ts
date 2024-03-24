import { ApiProperty } from '@nestjs/swagger';

import { ControllerResponse } from 'src/shared/core/presentation/ControllerResponse';

class ChatControllerCreateChatResponseBodyResult {
  @ApiProperty({
    description: '생성된 p_chat 관리번호',
    example: 1,
  })
  id: number;
}

export class ChatControllerCreateChatResponse extends ControllerResponse {
  @ApiProperty({
    required: true,
    description: 'result',
    example: ChatControllerCreateChatResponseBodyResult,
  })
  result: ChatControllerCreateChatResponseBodyResult;
}

class ChatControllerCreateChatReplyResponseBodyResult {
  @ApiProperty({
    description: '생성된 p_chat_reply 관리번호',
    example: 1,
  })
  id: number;
}

export class ChatControllerCreateChatReplyResponse extends ControllerResponse {
  @ApiProperty({
    required: true,
    description: 'result',
    example: ChatControllerCreateChatReplyResponseBodyResult,
  })
  result: ChatControllerCreateChatReplyResponseBodyResult;
}
