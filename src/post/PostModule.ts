import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/** Repository Implementations */
import { USER_REPOSITORY } from 'src/user/infrastructure/UserRepository';
import { MysqlUserRepository } from 'src/user/infrastructure/mysql/MysqlUserRepository';
import { SPACE_USER_REPOSITORY } from 'src/space/infrastructure/SpaceUserRepository';
import { MysqlSpaceUserRepository } from 'src/space/infrastructure/mysql/MysqlSpaceUserRepository';
import { POST_UPLOAD_FILE_REPOSITORY } from './infrastructure/PostUploadFileRepository';
import { MysqlPostUploadFileRepository } from './infrastructure/mysql/MysqlPostUploadFileRepository';
import { POST_REPOSITORY } from './infrastructure/PostRepository';
import { MysqlPostRepository } from './infrastructure/mysql/MysqlPostRepository';
import { SPACE_REPOSITORY } from 'src/space/infrastructure/SpaceRepository';
import { MysqlSpaceRepository } from 'src/space/infrastructure/mysql/MysqlSpaceRepository';
import { CHAT_REPOSITORY } from 'src/chat/infrastructure/ChatRepository';
import { MysqlChatRepository } from 'src/chat/infrastructure/mysql/MysqlChatRepository';

/** Entities */
import { PostEntity } from './infrastructure/entity/PostEntity';
import { UserEntity } from 'src/user/infrastructure/entity/UserEntity';
import { SpaceUserEntity } from 'src/space/infrastructure/entity/SpaceUserEntity';
import { SpaceEntity } from 'src/space/infrastructure/entity/SpaceEntity';
import { ChatEntity } from 'src/chat/infrastructure/entity/ChatEntity';

/** Controllers */
import { PostController } from './presentation/PostController';
import { PostUploadFileEntity } from './infrastructure/entity/PostUploadFileEntity';

/** UseCases */
import { CreatePostUseCase } from './application/CreatePostUseCase/CreatePostUseCase';
import { DeletePostUseCase } from './application/DeletePostUseCase/DeletePostUseCase';
import { FindPostChatsUseCase } from './application/FindPostChatsUseCase/FindPostChatsUseCase';
import { FindPostsByUserUseCase } from './application/FindPostsByUserUseCase/FindPostsByUserUseCase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity, //
      PostUploadFileEntity,
      UserEntity,
      SpaceUserEntity,
      SpaceEntity,
      ChatEntity,
    ]),
  ],
  exports: [PostModule],
  controllers: [PostController],
  providers: [
    CreatePostUseCase,
    FindPostChatsUseCase,
    FindPostsByUserUseCase,
    DeletePostUseCase,
    {
      provide: POST_REPOSITORY,
      useClass: MysqlPostRepository,
    },
    {
      provide: POST_UPLOAD_FILE_REPOSITORY,
      useClass: MysqlPostUploadFileRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: MysqlUserRepository,
    },
    {
      provide: SPACE_USER_REPOSITORY,
      useClass: MysqlSpaceUserRepository,
    },
    {
      provide: SPACE_REPOSITORY,
      useClass: MysqlSpaceRepository,
    },
    {
      provide: CHAT_REPOSITORY,
      useClass: MysqlChatRepository,
    },
  ],
})
export class PostModule {}
