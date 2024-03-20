import { ApiProperty } from '@nestjs/swagger';

export class UserControllerRequestParams {
  @ApiProperty({
    name: 'id',
    example: 3,
    required: true,
    description: '유저 ID',
  })
  id: string;
}
