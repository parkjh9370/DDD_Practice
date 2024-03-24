import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { SpaceUserEntity } from './SpaceUserEntity';
import { SpaceRoleEntity } from './SpaceRoleEntity';

export enum SpaceEntityIsUse {
  YES = 'Y',
  NO = 'N',
}

@Entity({ name: 'p_space' })
export class SpaceEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'ps_index' })
  index: number;

  @Column({ name: 'ps_name' })
  name: string;

  @Column({ name: 'ps_logo_image_url' })
  logoImageUrl: string;

  @Column({ name: 'ps_access_code' })
  accessCode: string;

  @Column({ name: 'ps_admin_access_code' })
  adminAccessCode: string;

  @Column({ name: 'ps_user_index' })
  userIndex: number;

  @Column({ name: 'ps_is_use' })
  isUse: SpaceEntityIsUse;

  @Column({ name: 'ps_register_date_time' })
  registerDateTime: string;

  @Column({ name: 'ps_update_date_time' })
  updateDateTime: string;

  @Column({ name: 'ps_delete_date_time' })
  deleteDateTime: string;

  @OneToMany(() => SpaceRoleEntity, (spaceRole) => spaceRole.space)
  @JoinColumn({ name: 'ps_index' })
  spaceRole: SpaceRoleEntity[];

  @OneToMany(() => SpaceUserEntity, (spaceUser) => spaceUser.space)
  @JoinColumn({ name: 'ps_index' })
  spaceUser: SpaceUserEntity[];
}
