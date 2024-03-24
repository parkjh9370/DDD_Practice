import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ChatEntity } from './ChatEntity';

export enum ChatReplyEntityIsAnonymous {
  YES = 'Y',
  NO = 'N',
}

export enum ChatReplyEntityIsUse {
  YES = 'Y',
  NO = 'N',
}

@Entity({ name: 'p_chat_reply' })
export class ChatReplyEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'pcr_index' })
  index: number;

  @Column({ name: 'pcr_cc_index' })
  chatIndex: number;

  @Column({ name: 'pcr_contents' })
  contents: string;

  @Column({ name: 'pcr_user_index' })
  userIndex: number;

  @Column({ name: 'pcr_post_index' })
  postIndex: number;

  @Column({ name: 'pcr_is_anonymous' })
  isAnonymous: ChatReplyEntityIsAnonymous;

  @Column({ name: 'pcr_is_use' })
  isUse: ChatReplyEntityIsUse;

  @Column({ name: 'pcr_register_date_time' })
  registerDateTime: string;

  @Column({ name: 'pcr_update_date_time' })
  updateDateTime: string;

  @Column({ name: 'pcr_delete_date_time' })
  deleteDateTime: string;

  @ManyToOne(() => ChatEntity, (chat) => chat.chatReply)
  @JoinColumn({ name: 'pcr_pc_index' })
  chat: ChatEntity;
}
