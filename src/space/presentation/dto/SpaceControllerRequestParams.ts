import { ApiProperty } from '@nestjs/swagger';

export class SpaceControllerRequestParams {
  @ApiProperty({
    name: 'id',
    example: '3',
    required: true,
    description: 'Space Id',
  })
  id?: string;

  @ApiProperty({
    name: 'userId',
    example: '3',
    required: true,
    description: '권한 변경할 user Id',
  })
  userId?: string;
}
