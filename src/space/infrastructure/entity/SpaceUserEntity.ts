import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from 'src/user/infrastructure/entity/UserEntity';
import { SpaceEntity } from './SpaceEntity';

export enum SpaceUserEntityIsCreateSpaceUser {
  YES = 'Y',
  NO = 'N',
}

export enum SpaceUserEntityHasAdministratorRights {
  YES = 'Y',
  NO = 'N',
}

export enum SpaceUserEntityIsParticipating {
  YES = 'Y',
  NO = 'N',
}

@Entity({ name: 'p_space_user' })
export class SpaceUserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'psu_index' })
  index: number;

  @Column({ name: 'psu_ps_index' })
  spaceIndex: number;

  @Column({ name: 'psu_pu_index' })
  userIndex: number;

  @Column({ name: 'psu_role' })
  role: string;

  @Column({ name: 'psu_has_administrator_rights' })
  hasAdministratorRights: SpaceUserEntityHasAdministratorRights;

  @Column({ name: 'psu_is_participating' })
  isParticipating: SpaceUserEntityIsParticipating;

  @Column({ name: 'psu_is_create_space_user' })
  isCreateSpaceUser: SpaceUserEntityIsCreateSpaceUser;

  @Column({ name: 'psu_register_date_time' })
  registerDateTime: string;

  @Column({ name: 'psu_update_date_time' })
  updateDateTime: string;

  @ManyToOne(() => SpaceEntity, (space) => space.spaceUser)
  @JoinColumn({ name: 'psu_ps_index' })
  space: SpaceEntity;

  @ManyToOne(() => UserEntity, (user) => user.spaceUser)
  @JoinColumn({ name: 'psu_pu_index' })
  user: UserEntity;
}
