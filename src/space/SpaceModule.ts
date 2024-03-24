import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/** Repository Implementations */
import { SPACE_REPOSITORY } from './infrastructure/SpaceRepository';
import { MysqlSpaceRepository } from './infrastructure/mysql/MysqlSpaceRepository';
import { SPACE_ROLE_REPOSITORY } from './infrastructure/SpaceRoleRepository';
import { MysqlSpaceRoleRepository } from './infrastructure/mysql/MysqlSpaceRoleRepository';
import { SPACE_USER_REPOSITORY } from './infrastructure/SpaceUserRepository';
import { MysqlSpaceUserRepository } from './infrastructure/mysql/MysqlSpaceUserRepository';
import { USER_REPOSITORY } from 'src/user/infrastructure/UserRepository';
import { MysqlUserRepository } from 'src/user/infrastructure/mysql/MysqlUserRepository';

/** Entities */
import { SpaceEntity } from './infrastructure/entity/SpaceEntity';
import { SpaceUserEntity } from './infrastructure/entity/SpaceUserEntity';
import { SpaceRoleEntity } from './infrastructure/entity/SpaceRoleEntity';
import { UserEntity } from 'src/user/infrastructure/entity/UserEntity';

/** Controllers */
import { SpaceController } from './presentation/SpaceController';

/** UseCases */
import { CreateSpaceUseCase } from './application/CreateSpaceUseCase/CreateSpaceUseCase';
import { FindOneSpaceUseCase } from './application/FindOneSpaceUseCase/FindOneSpaceUseCase';
import { FindOneUserUseCase } from 'src/user/application/FindOneUserUseCase/FindOneUserUseCase';
import { ParticipateInSpaceUseCase } from './application/ParticipateInSpaceUseCase/ParticipateInSpaceUseCase';
import { UpdateSpaceUserRightsUseCase } from './application/UpdateSpaceUserRightsUseCase/UpdateSpaceUserRightsUseCase';
import { DeleteSpaceUseCase } from './application/DeleteSpaceUseCase/DeleteSpaceUseCase';
import { DeleteSpaceRoleUseCase } from './application/DeleteSpaceRoleUseCase/DeleteSpaceRoleUseCase';
import { UpdateSpaceCreateUserUseCase } from './application/UpdateSpaceCreateUserUseCase/UpdateSpaceCreateUserUseCase';
import { FindSpacePostsUseCase } from './application/FindSpacePostsUseCase/FindSpacePostsUseCase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpaceEntity, //
      SpaceRoleEntity,
      SpaceUserEntity,
      UserEntity,
    ]),
  ],
  exports: [SpaceModule],
  controllers: [SpaceController],
  providers: [
    CreateSpaceUseCase,
    FindOneSpaceUseCase,
    FindOneUserUseCase,
    ParticipateInSpaceUseCase,
    UpdateSpaceCreateUserUseCase,
    UpdateSpaceUserRightsUseCase,
    DeleteSpaceUseCase,
    DeleteSpaceRoleUseCase,
    FindSpacePostsUseCase,
    {
      provide: SPACE_REPOSITORY,
      useClass: MysqlSpaceRepository,
    },
    {
      provide: SPACE_ROLE_REPOSITORY,
      useClass: MysqlSpaceRoleRepository,
    },
    {
      provide: SPACE_USER_REPOSITORY,
      useClass: MysqlSpaceUserRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: MysqlUserRepository,
    },
  ],
})
export class SpaceModule {}
