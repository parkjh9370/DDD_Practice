import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { SpaceUserEntity } from 'src/space/infrastructure/entity/SpaceUserEntity';

export enum UserEntityIsAdmin {
  YES = 'Y',
  NO = 'N',
}

export enum UserEntityIsUse {
  YES = 'Y',
  NO = 'N',
}

@Entity({ name: 'p_user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'pu_index' })
  index: number;

  @Column({ name: 'pu_email' })
  email: string;

  @Column({ name: 'pu_password' })
  password: string;

  @Column({ name: 'pu_last_name' })
  lastName: string;

  @Column({ name: 'pu_first_name' })
  firstName: string;

  @Column({ name: 'pu_profile_image_url' })
  profileImageUrl: string;

  @Column({ name: 'pu_is_admin' })
  isAdmin: UserEntityIsAdmin;

  @Column({ name: 'pu_is_use' })
  isUse: UserEntityIsUse;

  @Column({ name: 'pu_refresh_token' })
  refreshToken: string;

  @Column({ name: 'pu_refresh_token_expiration_date_time' })
  refreshTokenExpirationDateTime: string;

  @Column({ name: 'pu_register_date_time' })
  registerDateTime: string;

  @Column({ name: 'pu_update_date_time' })
  updateDateTime: string;

  @Column({ name: 'pu_delete_date_time' })
  deleteDateTime: string;

  @OneToMany(() => SpaceUserEntity, (spaceUser) => spaceUser.user)
  @JoinColumn({ name: 'pu_index' })
  spaceUser: SpaceUserEntity[];
}
