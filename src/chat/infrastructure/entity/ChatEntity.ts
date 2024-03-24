import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { PostEntity } from 'src/post/infrastructure/entity/PostEntity';
import { ChatReplyEntity } from './ChatReplyEntity';

export enum ChatEntityIsUse {
  YES = 'Y',
  NO = 'N',
}

export enum ChatEntityIsAnonymous {
  YES = 'Y',
  NO = 'N',
}

@Entity({ name: 'p_chat' })
export class ChatEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'pc_index' })
  index: number;

  @Column({ name: 'pc_pp_index' })
  postIndex: number;

  @Column({ name: 'pc_contents' })
  contents: string;

  @Column({ name: 'pc_user_index' })
  userIndex: number;

  @Column({ name: 'pc_is_anonymous' })
  isAnonymous: ChatEntityIsAnonymous;

  @Column({ name: 'pc_is_use' })
  isUse: ChatEntityIsUse;

  @Column({ name: 'pc_register_date_time' })
  registerDateTime: string;

  @Column({ name: 'pc_update_date_time' })
  updateDateTime: string;

  @Column({ name: 'pc_delete_date_time' })
  deleteDateTime: string;

  @ManyToOne(() => PostEntity, (post) => post.chat)
  @JoinColumn({ name: 'pc_pp_index' })
  post: PostEntity;

  @OneToMany(() => ChatReplyEntity, (chatReply) => chatReply.chat)
  @JoinColumn({ name: 'pc_index' })
  chatReply: ChatReplyEntity[];
}
