import { ApiProperty } from '@nestjs/swagger';

import { ControllerResponse } from 'src/shared/core/presentation/ControllerResponse';

export class UploadControllerUploadResponse extends ControllerResponse {
  @ApiProperty({
    name: 'fileUrl',
    example: 'https://files-dev.s3.ap-northeast-2.amazonaws.com/b138133b-9c55-47fc-a11c-0a04b949d4af.jpeg',
    description: '업로드 파일 URL',
  })
  fileUrl: string;
}
