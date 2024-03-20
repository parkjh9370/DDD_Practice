import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// import { SpaceUserEntity } from 'src/space/infrastructure/entity/SpaceUserEntity';

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
  @PrimaryGeneratedColumn({ name: 'p_index' })
  index: number;

  @Column({ name: 'p_email' })
  email: string;

  @Column({ name: 'p_password' })
  password: string;

  @Column({ name: 'p_last_name' })
  lastName: string;

  @Column({ name: 'p_first_name' })
  firstName: string;

  @Column({ name: 'p_profile_image_url' })
  profileImageUrl: string;

  @Column({ name: 'p_is_admin' })
  isAdmin: UserEntityIsAdmin;

  @Column({ name: 'p_is_use' })
  isUse: UserEntityIsUse;

  @Column({ name: 'p_refresh_token' })
  refreshToken: string;

  @Column({ name: 'p_refresh_token_expiration_date_time' })
  refreshTokenExpirationDateTime: string;

  @Column({ name: 'p_register_date_time' })
  registerDateTime: string;

  @Column({ name: 'p_update_date_time' })
  updateDateTime: string;

  @Column({ name: 'p_delete_date_time' })
  deleteDateTime: string;

  // @OneToMany(() => SpaceUserEntity, (spaceUser) => spaceUser.user)
  // @JoinColumn({ name: 'p_index' })
  // spaceUser: SpaceUserEntity[];
}
