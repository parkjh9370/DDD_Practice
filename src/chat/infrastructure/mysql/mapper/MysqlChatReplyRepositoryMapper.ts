import { ChatReply } from 'src/chat/domain/ChatReply';
import { ChatReplyEntityIsUse, ChatReplyEntityIsAnonymous, ChatReplyEntity } from '../../entity/ChatReplyEntity';

export class MysqlChatReplyRepositoryMapper {
  static toDomain(entity: ChatReplyEntity): ChatReply {
    return ChatReply.create(
      {
        chatIndex: entity.chatIndex,
        contents: entity.contents,
        userIndex: entity.userIndex,
        postIndex: entity.postIndex,
        isAnonymous: entity.isAnonymous === ChatReplyEntityIsAnonymous.YES ? true : false,
        isUse: entity.isUse === ChatReplyEntityIsUse.YES ? true : false,
      },
      entity.index,
    ).value;
  }

  static toDomains(entities: ChatReplyEntity[]): ChatReply[] {
    return entities.map((entity) => {
      return this.toDomain(entity);
    });
  }
}
