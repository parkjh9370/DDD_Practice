import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/user/domain/User';
import { MysqlUserRepositoryMapper } from './mapper/MysqlUserRepositoryMapper';
import { UserRepository, UserRepositoryFindOneByOptions, UserRepositoryUpdateByOptions } from '../UserRepository';
import { UserEntity, UserEntityIsAdmin } from '../entity/UserEntity';

export class MysqlUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(user: User, hashedPassword: string): Promise<number> {
    const entity = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values({
        email: user.email,
        password: hashedPassword,
        lastName: user.lastName,
        firstName: user.firstName,
        profileImageUrl: user.profileImageUrl,
        isAdmin: user.isAdmin === true ? UserEntityIsAdmin.YES : UserEntityIsAdmin.NO,
        registerDateTime: dayjs(new Date()).add(30, 'day').format('YYYY-MM-DD HH:mm:ss'),
      })
      .execute();

    return entity.raw.insertId;
  }

  async findOneByOptions(options: UserRepositoryFindOneByOptions): Promise<User | null> {
    const { id, email } = options;

    let whereClause = `1=1`;

    if (id) {
      whereClause += ` AND user.cu_index = ${id}`;
    }

    if (email) {
      whereClause += ` AND user.cu_email = '${email}'`;
    }

    const entity = await this.userRepository
      .createQueryBuilder(`user`)
      .leftJoinAndSelect(`user.spaceUser`, `spaceUser`)
      .where(whereClause)
      .getOne();

    return entity ? MysqlUserRepositoryMapper.toDomain(entity) : null;
  }

  async updateByOptions(user: User, options: UserRepositoryUpdateByOptions): Promise<void> {
    const { refreshToken, lastName, firstName, profileImageUrl } = options;

    if (typeof refreshToken === 'string') {
      this.updateRefreshToken(user, refreshToken);
    }

    if (lastName && firstName && profileImageUrl) {
      this.updateProfile(user, lastName, firstName, profileImageUrl);
    }

    return;
  }

  private updateRefreshToken(user: User, token: string): void {
    this.userRepository
      .createQueryBuilder()
      .update<UserEntity>(UserEntity, {
        refreshToken: token,
        refreshTokenExpirationDateTime: dayjs(new Date()).add(30, 'day').format('YYYY-MM-DD HH:mm:ss'),
      })
      .where(`index = ${user.id}`)
      .execute();
  }

  private updateProfile(user: User, lastName: string, firstName: string, profileImageUrl: string) {
    this.userRepository
      .createQueryBuilder()
      .update<UserEntity>(UserEntity, {
        lastName: lastName,
        firstName: firstName,
        profileImageUrl: profileImageUrl,
        updateDateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      })
      .where(`index = ${user.id}`)
      .execute();
  }
}
