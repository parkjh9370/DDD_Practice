import { ApiProperty } from '@nestjs/swagger';

export class SpaceControllerCreateRequestBodyRoles {
  @ApiProperty({
    name: 'role',
    example: 'PROFESSOR',
    required: true,
    description: '역할',
  })
  role: string;

  @ApiProperty({
    name: 'rights',
    example: true,
    required: true,
    description: '권한',
  })
  hasAdministratorRights: boolean;
}

export class SpaceControllerCreateRequestBody {
  @ApiProperty({
    name: 'name',
    example: '미적분 강의 Q&A',
    required: true,
    description: 'Space 이름',
  })
  name: string;

  @ApiProperty({
    name: 'logoImageUrl',
    example: 'https://classum-files-dev.s3.ap-northeast-2.amazonaws.com/b138133b-9c55-47fc-a11c-0a04b949d4af.jpeg',
    required: true,
    description: '로고 이미지 URL',
  })
  logoImageUrl: string;

  @ApiProperty({
    name: 'spaceRoles',
    example: [
      {
        role: 'PROFESSOR',
        hasAdministratorRights: true,
      },
      {
        role: 'ASSISTANCE',
        hasAdministratorRights: true,
      },
      {
        role: 'STUDENT',
        hasAdministratorRights: false,
      },
    ],
    isArray: true,
    required: true,
    description: '역할 세트',
  })
  roles: SpaceControllerCreateRequestBodyRoles[];
}
