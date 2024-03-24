import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Chat } from 'src/chat/domain/Chat';
import { ChatRepository, ChatRepositoryFindByOptions, ChatRepositoryFindOneByOptions } from '../ChatRepository';
import { ChatEntity, ChatEntityIsAnonymous, ChatEntityIsUse } from '../entity/ChatEntity';
import { MysqlChatRepositoryMapper } from './mapper/MysqlChatRepositoryMapper';

export class MysqlChatRepository implements ChatRepository {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
  ) {}

  async save(chat: Chat): Promise<number> {
    const entity = await this.chatRepository
      .createQueryBuilder()
      .insert()
      .into(ChatEntity)
      .values({
        postIndex: chat.postIndex,
        contents: chat.contents,
        userIndex: chat.userIndex,
        isAnonymous: chat.isAnonymous === true ? ChatEntityIsAnonymous.YES : ChatEntityIsAnonymous.NO,
        isUse: chat.isUse === true ? ChatEntityIsUse.YES : ChatEntityIsUse.NO,
        registerDateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      })
      .execute();

    return entity.raw.insertId;
  }

  async delete(chat: Chat): Promise<void> {
    await this.chatRepository
      .createQueryBuilder()
      .update<ChatEntity>(ChatEntity, {
        isUse: ChatEntityIsUse.NO,
        deleteDateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      })
      .where(`index = ${chat.id}`)
      .execute();
  }

  async findOneByOptions(options: ChatRepositoryFindOneByOptions): Promise<Chat> {
    const { id } = options;

    let whereClause = `1=1`;

    if (id) {
      whereClause += ` AND chat.cc_index = ${id}`;
    }

    const entity = await this.chatRepository
      .createQueryBuilder(`chat`) //
      .leftJoinAndSelect(`chat.chatReply`, `chatReply`)
      .where(whereClause)
      .orderBy(`chatReply.ccr_index`, `ASC`)
      .getOne();

    return entity ? MysqlChatRepositoryMapper.toDomain(entity) : null;
  }

  async findByOptions(options: ChatRepositoryFindByOptions): Promise<Chat[]> {
    const { postId, userId } = options;

    let whereClause = `1=1`;

    if (postId) {
      whereClause += ` AND chat.cc_cp_index = ${postId}`;
    }

    if (userId) {
      whereClause += ` AND chat.cc_user_index = ${userId}`;
    }

    const entities = await this.chatRepository
      .createQueryBuilder(`chat`) //
      .leftJoinAndSelect(`chat.chatReply`, `chatReply`)
      .where(whereClause)
      .orderBy(`chat.cc_index`, `ASC`)
      .orderBy(`chatReply.ccr_index`, `ASC`)
      .getMany();

    return entities ? MysqlChatRepositoryMapper.toDomains(entities) : [];
  }
}
