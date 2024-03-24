import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { SpaceUser } from 'src/space/domain/SpaceUser';
import { SpaceUserFindByOptions, SpaceUserFindOneByOptions, SpaceUserRepository } from '../SpaceUserRepository';
import { SpaceUserEntity, SpaceUserEntityHasAdministratorRights, SpaceUserEntityIsCreateSpaceUser, SpaceUserEntityIsParticipating } from '../entity/SpaceUserEntity';
import { MysqlSpaceUserRepositoryMapper } from './mapper/MysqlSpaceUserRepositoryMapper';

export class MysqlSpaceUserRepository implements SpaceUserRepository {
  constructor(
    @InjectRepository(SpaceUserEntity)
    private readonly spaceUserRepository: Repository<SpaceUserEntity>,
  ) {}

  async save(spaceUser: SpaceUser): Promise<void> {
    await this.spaceUserRepository
      .createQueryBuilder()
      .insert()
      .into(SpaceUserEntity)
      .values({
        spaceIndex: spaceUser.spaceIndex,
        userIndex: spaceUser.userIndex,
        role: spaceUser.role,
        hasAdministratorRights: spaceUser.hasAdministratorRights === true ? SpaceUserEntityHasAdministratorRights.YES : SpaceUserEntityHasAdministratorRights.NO,
        isParticipating: spaceUser.isParticipating === true ? SpaceUserEntityIsParticipating.YES : SpaceUserEntityIsParticipating.NO,
        isCreateSpaceUser: spaceUser.isCreateSpaceUser === true ? SpaceUserEntityIsCreateSpaceUser.YES : SpaceUserEntityIsCreateSpaceUser.NO,
        registerDateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      })
      .execute();

    return;
  }

  async update(spaceUser: SpaceUser): Promise<void> {
    await this.spaceUserRepository
      .createQueryBuilder()
      .update<SpaceUserEntity>(SpaceUserEntity, {
        role: spaceUser.role,
        hasAdministratorRights: spaceUser.hasAdministratorRights === true ? SpaceUserEntityHasAdministratorRights.YES : SpaceUserEntityHasAdministratorRights.NO,
        isCreateSpaceUser: spaceUser.isCreateSpaceUser === true ? SpaceUserEntityIsCreateSpaceUser.YES : SpaceUserEntityIsCreateSpaceUser.NO,
        updateDateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      })
      .where(`csu_index = ${spaceUser.id}`)
      .execute();
  }

  async updateIsParticipating(spaceUser: SpaceUser, isParticipating: boolean): Promise<void> {
    await this.spaceUserRepository
      .createQueryBuilder()
      .update<SpaceUserEntity>(SpaceUserEntity, {
        isParticipating: isParticipating === true ? SpaceUserEntityIsParticipating.YES : SpaceUserEntityIsParticipating.NO,
        updateDateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      })
      .where(`csu_index = ${spaceUser.id}`)
      .execute();
  }

  async updateAdministratorRights(spaceUser: SpaceUser, AdministratorRights: boolean): Promise<void> {
    await this.spaceUserRepository
      .createQueryBuilder()
      .update<SpaceUserEntity>(SpaceUserEntity, {
        hasAdministratorRights: AdministratorRights === true ? SpaceUserEntityHasAdministratorRights.YES : SpaceUserEntityHasAdministratorRights.NO,
        updateDateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      })
      .where(`csu_index = ${spaceUser.id}`)
      .execute();
  }

  async findOneByOptions(options: SpaceUserFindOneByOptions): Promise<SpaceUser | null> {
    const { userId, spaceId } = options;

    let whereClause = `1=1`;

    if (userId) {
      whereClause += ` AND spaceUser.csu_cu_index = ${userId}`;
    }

    if (spaceId) {
      whereClause += ` AND spaceUser.csu_cs_index = ${spaceId}`;
    }

    const entity = await this.spaceUserRepository //
      .createQueryBuilder(`spaceUser`)
      .where(whereClause)
      .getOne();

    return entity ? MysqlSpaceUserRepositoryMapper.toDomain(entity) : null;
  }

  async findByOptions(options: SpaceUserFindByOptions): Promise<SpaceUser[]> {
    const { spaceId } = options;

    let whereClause = `1=1`;

    if (spaceId) {
      whereClause += ` AND spaceUser.csu_cs_index = ${spaceId}`;
    }

    const entities = await this.spaceUserRepository //
      .createQueryBuilder(`spaceUser`)
      .where(whereClause)
      .getMany();

    return entities ? MysqlSpaceUserRepositoryMapper.toDomains(entities) : [];
  }
}
