import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { SpaceEntity } from './SpaceEntity';

export enum SpaceRoleEntityIsOriginUser {
  YES = 'Y',
  NO = 'N',
}

export enum SpaceRoleEntityIsUse {
  YES = 'Y',
  NO = 'N',
}

export enum SpaceRoleEntityHasAdministratorRights {
  YES = 'Y',
  NO = 'N',
}

@Entity({ name: 'p_space_role' })
export class SpaceRoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'psr_index' })
  index: number;

  @Column({ name: 'psr_ps_index' })
  spaceIndex: number;

  @Column({ name: 'psr_role' })
  role: string;

  @Column({ name: 'psr_has_administrator_rights' })
  hasAdministratorRights: SpaceRoleEntityHasAdministratorRights;

  @Column({ name: 'psr_is_use' })
  isUse: SpaceRoleEntityIsUse;

  @Column({ name: 'psr_register_date_time' })
  registerDateTime: string;

  @Column({ name: 'psr_update_date_time' })
  updateDateTime: string;

  @Column({ name: 'psr_delete_date_time' })
  deleteDateTime: string;

  @ManyToOne(() => SpaceEntity, (space) => space.spaceRole)
  @JoinColumn({ name: 'psr_ps_index' })
  space: SpaceEntity;
}
