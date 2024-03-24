import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { PostEntity } from './PostEntity';

export enum PostUploadFileEntityIsUse {
  YES = 'Y',
  NO = 'N',
}

@Entity({ name: 'p_post_upload_file' })
export class PostUploadFileEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'ppuf_index' })
  index: number;

  @Column({ name: 'ppuf_pp_index' })
  postIndex: number;

  @Column({ name: 'ppuf_file_url' })
  fileUrl: string;

  @Column({ name: 'ppuf_is_use' })
  isUse: PostUploadFileEntityIsUse;

  @Column({ name: 'ppuf_register_date_time' })
  registerDateTime: string;

  @Column({ name: 'ppuf_delete_date_time' })
  deleteDateTime: string;

  @ManyToOne(() => PostEntity, (space) => space.postUploadFile)
  @JoinColumn({ name: 'ppuf_pp_index' })
  post: PostEntity;
}
