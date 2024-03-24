import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { SpaceEntity } from 'src/space/infrastructure/entity/SpaceEntity';
import { PostUploadFileEntity } from './PostUploadFileEntity';
import { ChatEntity } from 'src/chat/infrastructure/entity/ChatEntity';

export enum PostEntityIsUse {
  YES = 'Y',
  NO = 'N',
}

export enum PostEntityIsAnonymous {
  YES = 'Y',
  NO = 'N',
}

@Entity({ name: 'p_post' })
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'pp_index' })
  index: number;

  @Column({ name: 'pp_ps_index' })
  spaceIndex: number;

  @Column({ name: 'pp_name' })
  name: string;

  @Column({ name: 'pp_type' })
  type: string;

  @Column({ name: 'pp_contents' })
  contents: string;

  @Column({ name: 'pp_user_index' })
  userIndex: number;

  @Column({ name: 'pp_is_anonymous' })
  isAnonymous: PostEntityIsAnonymous;

  @Column({ name: 'pp_is_use' })
  isUse: PostEntityIsUse;

  @Column({ name: 'pp_register_date_time' })
  registerDateTime: string;

  @Column({ name: 'pp_update_date_time' })
  updateDateTime: string;

  @Column({ name: 'pp_delete_date_time' })
  deleteDateTime: string;

  @ManyToOne(() => SpaceEntity, (space) => space.post)
  @JoinColumn({ name: 'pp_ps_index' })
  space: SpaceEntity;

  @OneToMany(() => PostUploadFileEntity, (postUploadFile) => postUploadFile.post)
  @JoinColumn({ name: 'pp_index' })
  postUploadFile: PostUploadFileEntity[];

  @OneToMany(() => ChatEntity, (chat) => chat.post)
  @JoinColumn({ name: 'pp_index' })
  chat: ChatEntity[];
}
