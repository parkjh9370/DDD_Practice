import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/** Repository Implementations */
import { CHAT_REPOSITORY } from './infrastructure/ChatRepository';
import { MysqlChatRepository } from './infrastructure/mysql/MysqlChatRepository';
import { CHAT_REPLY_REPOSITORY } from './infrastructure/ChatReplyRepository';
import { MysqlChatReplyRepository } from './infrastructure/mysql/MysqlChatReplyRepository';
import { SPACE_USER_REPOSITORY } from 'src/space/infrastructure/SpaceUserRepository';
import { MysqlSpaceUserRepository } from 'src/space/infrastructure/mysql/MysqlSpaceUserRepository';

/** Entities */
import { ChatEntity } from './infrastructure/entity/ChatEntity';
import { ChatReplyEntity } from './infrastructure/entity/ChatReplyEntity';
import { PostEntity } from 'src/post/infrastructure/entity/PostEntity';
import { SpaceEntity } from 'src/space/infrastructure/entity/SpaceEntity';
import { SpaceUserEntity } from 'src/space/infrastructure/entity/SpaceUserEntity';
import { UserEntity } from 'src/user/infrastructure/entity/UserEntity';

/** Controllers */
import { ChatController } from './presentation/ChatController';

/** UseCases */
import { CreateChatUseCase } from './application/CreateChatUseCase/CreateChatUseCase';
import { CreateChatReplyUseCase } from './application/CreateChatReplyUseCase/CreateChatReplyUseCase';
import { DeleteChatUseCase } from './application/DeleteChatUseCase/DeleteChatUseCase';
import { DeleteChatReplyUseCase } from './application/DeleteChatReplyUseCase/DeleteChatReplyUseCase';
import { POST_REPOSITORY } from 'src/post/infrastructure/PostRepository';
import { MysqlPostRepository } from 'src/post/infrastructure/mysql/MysqlPostRepository';
import { SPACE_REPOSITORY } from 'src/space/infrastructure/SpaceRepository';
import { MysqlSpaceRepository } from 'src/space/infrastructure/mysql/MysqlSpaceRepository';
import { USER_REPOSITORY } from 'src/user/infrastructure/UserRepository';
import { MysqlUserRepository } from 'src/user/infrastructure/mysql/MysqlUserRepository';
import { FindChatsByUserIdUseCase } from './application/FindChatsByUserIdUseCase/FindChatsByUserIdUseCase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatEntity, //
      ChatReplyEntity,
      PostEntity,
      SpaceEntity,
      SpaceUserEntity,
      UserEntity,
    ]),
  ],
  exports: [ChatModule],
  controllers: [ChatController],
  providers: [
    CreateChatUseCase,
    CreateChatReplyUseCase,
    DeleteChatUseCase,
    DeleteChatReplyUseCase,
    FindChatsByUserIdUseCase,
    {
      provide: CHAT_REPOSITORY,
      useClass: MysqlChatRepository,
    },
    {
      provide: CHAT_REPLY_REPOSITORY,
      useClass: MysqlChatReplyRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: MysqlUserRepository,
    },
    {
      provide: SPACE_REPOSITORY,
      useClass: MysqlSpaceRepository,
    },
    {
      provide: SPACE_USER_REPOSITORY,
      useClass: MysqlSpaceUserRepository,
    },
    {
      provide: POST_REPOSITORY,
      useClass: MysqlPostRepository,
    },
  ],
})
export class ChatModule {}
