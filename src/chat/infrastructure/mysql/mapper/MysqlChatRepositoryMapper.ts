import { Chat } from 'src/chat/domain/Chat';
import { ChatReply } from 'src/chat/domain/ChatReply';
import { ChatEntity, ChatEntityIsAnonymous, ChatEntityIsUse } from '../../entity/ChatEntity';
import { ChatReplyEntityIsUse, ChatReplyEntityIsAnonymous } from '../../entity/ChatReplyEntity';

export class MysqlChatRepositoryMapper {
  static toDomain(entity: ChatEntity): Chat {
    return Chat.create(
      {
        postIndex: entity.postIndex,
        contents: entity.contents,
        userIndex: entity.userIndex,
        isAnonymous: entity.isAnonymous === ChatEntityIsAnonymous.YES ? true : false,
        isUse: entity.isUse === ChatEntityIsUse.YES ? true : false,
        chatReply: entity.chatReply.map(
          (chatReply) =>
            ChatReply.create(
              {
                chatIndex: chatReply.chatIndex,
                contents: chatReply.contents,
                userIndex: chatReply.userIndex,
                postIndex: chatReply.postIndex,
                isAnonymous: chatReply.isAnonymous === ChatReplyEntityIsAnonymous.YES ? true : false,
                isUse: chatReply.isUse === ChatReplyEntityIsUse.YES ? true : false,
              },
              chatReply.index,
            ).value,
        ),
      },
      entity.index,
    ).value;
  }

  static toDomains(entities: ChatEntity[]): Chat[] {
    return entities.map((entity) => {
      return this.toDomain(entity);
    });
  }
}
