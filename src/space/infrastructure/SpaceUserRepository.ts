import { SpaceUser } from '../domain/SpaceUser';

export const SPACE_USER_REPOSITORY = Symbol('SPACE_USER_REPOSITORY');

export interface SpaceUserFindOneByOptions {
  userId?: number;
  spaceId?: number;
}

export interface SpaceUserFindByOptions {
  spaceId: number;
}

export interface SpaceUserRepository {
  save(spaceUser: SpaceUser): Promise<void>;

  update(spaceUser: SpaceUser): Promise<void>;

  updateAdministratorRights(spaceUser: SpaceUser, administratorRights: boolean): Promise<void>;

  updateIsParticipating(spaceUser: SpaceUser, isParticipating: boolean): Promise<void>;

  findOneByOptions(options: SpaceUserFindOneByOptions): Promise<SpaceUser | null>;

  findByOptions(options: SpaceUserFindByOptions): Promise<SpaceUser[]>;
}
