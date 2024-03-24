import { Space } from '../domain/Space';

export const SPACE_REPOSITORY = Symbol('SPACE_REPOSITORY');

export interface SpaceRepositoryFindOneByOptions {
  id?: number;
}

export interface SpaceRepositoryFindByOptions {
  userId?: number;
}

export interface SpaceRepository {
  save(space: Space): Promise<number>;

  findOneByOptions(options: SpaceRepositoryFindOneByOptions): Promise<Space | null>;

  findByOptions(options: SpaceRepositoryFindByOptions): Promise<Space[]>;

  delete(space: Space): Promise<void>;
}
