import { ApiProperty } from '@nestjs/swagger';

export class PostControllerRequestParams {
  @ApiProperty({
    name: 'id',
    example: '2',
    required: true,
    description: 'post Id',
  })
  id: string;

  @ApiProperty({
    name: 'spaceId',
    example: '2',
    required: true,
    description: 'space Id',
  })
  spaceId: string;
}
