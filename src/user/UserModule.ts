import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/** Repository Implementations */
import { USER_REPOSITORY } from './infrastructure/UserRepository';
import { MysqlUserRepository } from './infrastructure/mysql/MysqlUserRepository';
import { SPACE_REPOSITORY } from 'src/space/infrastructure/SpaceRepository';
import { MysqlSpaceRepository } from 'src/space/infrastructure/mysql/MysqlSpaceRepository';
import { POST_REPOSITORY } from 'src/post/infrastructure/PostRepository';
import { MysqlPostRepository } from 'src/post/infrastructure/mysql/MysqlPostRepository';
import { CHAT_REPOSITORY } from 'src/chat/infrastructure/ChatRepository';
import { MysqlChatRepository } from 'src/chat/infrastructure/mysql/MysqlChatRepository';
import { CHAT_REPLY_REPOSITORY } from 'src/chat/infrastructure/ChatReplyRepository';
import { MysqlChatReplyRepository } from 'src/chat/infrastructure/mysql/MysqlChatReplyRepository';

/** Entities */
import { UserEntity } from './infrastructure/entity/UserEntity';
import { SpaceEntity } from 'src/space/infrastructure/entity/SpaceEntity';
import { PostEntity } from 'src/post/infrastructure/entity/PostEntity';
import { ChatEntity } from 'src/chat/infrastructure/entity/ChatEntity';
import { ChatReplyEntity } from 'src/chat/infrastructure/entity/ChatReplyEntity';

/** Controllers */
import { UserController } from './presentation/UserController';

/** UseCases */
import { CreateUserUseCase } from './application/CreateUserUseCase/CreateUserUseCase';
import { FindOneUserUseCase } from './application/FindOneUserUseCase/FindOneUserUseCase';
import { UpdateUserUseCase } from './application/UpdateUserUseCase/UpdateUserUseCase';
import { FindOneSpaceUseCase } from 'src/space/application/FindOneSpaceUseCase/FindOneSpaceUseCase';
import { FindParticipatingSpaceListUseCase } from './application/FindParticipatingSpaceListUseCase/FindParticipatingSpaceListUseCase';
import { FindPostsByUserUseCase } from 'src/post/application/FindPostsByUserUseCase/FindPostsByUserUseCase';
import { FindChatsByUserIdUseCase } from 'src/chat/application/FindChatsByUserIdUseCase/FindChatsByUserIdUseCase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      SpaceEntity,
      PostEntity,
      ChatEntity,
      ChatReplyEntity,
    ]),
  ],
  exports: [UserModule],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    FindOneUserUseCase,
    UpdateUserUseCase,
    FindOneSpaceUseCase,
    FindParticipatingSpaceListUseCase,
    FindPostsByUserUseCase,
    FindChatsByUserIdUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: MysqlUserRepository,
    },
    {
      provide: SPACE_REPOSITORY,
      useClass: MysqlSpaceRepository,
    },
    {
      provide: POST_REPOSITORY,
      useClass: MysqlPostRepository,
    },
    {
      provide: CHAT_REPOSITORY,
      useClass: MysqlChatRepository,
    },
    {
      provide: CHAT_REPLY_REPOSITORY,
      useClass: MysqlChatReplyRepository,
    },
  ],
})
export class UserModule {}
