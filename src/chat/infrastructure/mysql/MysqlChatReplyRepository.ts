import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ChatReply } from 'src/chat/domain/ChatReply';
import { ChatReplyRepository, ChatReplyRepositoryFindByOptions, ChatReplyRepositoryFindOneByOptions } from '../ChatReplyRepository';
import { ChatReplyEntity, ChatReplyEntityIsAnonymous, ChatReplyEntityIsUse } from '../entity/ChatReplyEntity';
import { MysqlChatReplyRepositoryMapper } from './mapper/MysqlChatReplyRepositoryMapper';

export class MysqlChatReplyRepository implements ChatReplyRepository {
  constructor(
    @InjectRepository(ChatReplyEntity)
    private readonly chatReplyRepository: Repository<ChatReplyEntity>,
  ) {}

  async save(chatReply: ChatReply): Promise<number> {
    const entity = await this.chatReplyRepository
      .createQueryBuilder()
      .insert()
      .into(ChatReplyEntity)
      .values({
        chatIndex: chatReply.chatIndex,
        contents: chatReply.contents,
        userIndex: chatReply.userIndex,
        postIndex: chatReply.postIndex,
        isAnonymous: chatReply.isAnonymous === true ? ChatReplyEntityIsAnonymous.YES : ChatReplyEntityIsAnonymous.NO,
        isUse: chatReply.isUse === true ? ChatReplyEntityIsUse.YES : ChatReplyEntityIsUse.NO,
        registerDateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      })
      .execute();

    return entity.raw.insertId;
  }

  async findOneByOptions(options: ChatReplyRepositoryFindOneByOptions): Promise<ChatReply> {
    const { id } = options;

    let whereClause = `1=1`;

    if (id) {
      whereClause += ` AND chatReply.ccr_index = ${id}`;
    }

    const entity = await this.chatReplyRepository
      .createQueryBuilder(`chatReply`) //
      .where(whereClause)
      .orderBy('chatReply.ccr_index', 'ASC')
      .getOne();

    return entity ? MysqlChatReplyRepositoryMapper.toDomain(entity) : null;
  }

  async findByOptions(options: ChatReplyRepositoryFindByOptions): Promise<ChatReply[]> {
    const { userId } = options;

    let whereClause = `1=1`;

    if (userId) {
      whereClause += ` AND chatReply.ccr_user_index = ${userId}`;
    }

    const entities = await this.chatReplyRepository
      .createQueryBuilder(`chatReply`) //
      .where(whereClause)
      .orderBy('chatReply.ccr_index', 'ASC')
      .getMany();

    return entities ? MysqlChatReplyRepositoryMapper.toDomains(entities) : [];
  }

  async delete(chatReply: ChatReply): Promise<void> {
    await this.chatReplyRepository
      .createQueryBuilder()
      .update<ChatReplyEntity>(ChatReplyEntity, {
        isUse: ChatReplyEntityIsUse.NO,
        deleteDateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      })
      .where(`index = ${chatReply.id}`)
      .execute();
  }
}
