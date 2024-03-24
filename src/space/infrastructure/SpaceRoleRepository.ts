import { SpaceRole } from '../domain/SpaceRole';

export const SPACE_ROLE_REPOSITORY = Symbol('SPACE_ROLE_REPOSITORY');

export interface SpaceRoleFindByOptions {
  spaceId: number;
}

export interface SpaceRoleRepository {
  save(spaceRole: SpaceRole): Promise<void>;

  findByOptions(options: SpaceRoleFindByOptions): Promise<SpaceRole[]>;

  delete(spaceRole: SpaceRole): Promise<void>;
}
