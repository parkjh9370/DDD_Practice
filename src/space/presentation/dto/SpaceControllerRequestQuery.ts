import { ApiProperty } from '@nestjs/swagger';

export class SpaceControllerRequestQuery {
  @ApiProperty({
    name: 'rights',
    example: '1',
    required: true,
    description: `권한\n
    1: 권한 부여 \n
    `,
  })
  rights: string;

  @ApiProperty({
    name: 'role',
    example: 'PROFESSOR',
    required: true,
    description: '역할',
  })
  role: string;
}
