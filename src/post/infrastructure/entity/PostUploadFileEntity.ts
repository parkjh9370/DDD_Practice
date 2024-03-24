import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { PostEntity } from './PostEntity';

export enum PostUploadFileEntityIsUse {
  YES = 'Y',
  NO = 'N',
}

@Entity({ name: 'classum_post_upload_file' })
export class PostUploadFileEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'cpuf_index' })
  index: number;

  @Column({ name: 'cpuf_cp_index' })
  postIndex: number;

  @Column({ name: 'cpuf_file_url' })
  fileUrl: string;

  @Column({ name: 'cpuf_is_use' })
  isUse: PostUploadFileEntityIsUse;

  @Column({ name: 'cpuf_register_date_time' })
  registerDateTime: string;

  @Column({ name: 'cpuf_delete_date_time' })
  deleteDateTime: string;

  @ManyToOne(() => PostEntity, (space) => space.postUploadFile)
  @JoinColumn({ name: 'cpuf_cp_index' })
  post: PostEntity;
}
