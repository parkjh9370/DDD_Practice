import { User } from '../domain/User';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepositoryFindOneByOptions {
  id?: number;
  email?: string;
}

export interface UserRepositoryUpdateByOptions {
  refreshToken?: string;
  lastName?: string;
  firstName?: string;
  profileImageUrl?: string;
}

export interface UserRepository {
  save(user: User, hashedPassword: string): Promise<number>;

  findOneByOptions(options: UserRepositoryFindOneByOptions): Promise<User | null>;

  updateByOptions(user: User, options: UserRepositoryUpdateByOptions): Promise<void>;
}
