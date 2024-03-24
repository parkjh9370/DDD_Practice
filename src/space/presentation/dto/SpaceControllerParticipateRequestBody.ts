import { ApiProperty } from '@nestjs/swagger';

export class SpaceControllerParticipateRequestBody {
  @ApiProperty({
    name: 'accessCode',
    example: '33e24aa6',
    required: true,
    description: '참여 코드',
  })
  accessCode: string;

  @ApiProperty({
    name: 'role',
    example: 'PROFESSOR',
    required: true,
    description: '역할',
  })
  role: string;
}
