import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Space } from 'src/space/domain/Space';
import { SpaceRepository, SpaceRepositoryFindByOptions, SpaceRepositoryFindOneByOptions } from '../SpaceRepository';
import { SpaceEntity, SpaceEntityIsUse } from '../entity/SpaceEntity';
import { MysqlSpaceRepositoryMapper } from './mapper/MysqlSpaceRepositoryMapper';

export class MysqlSpaceRepository implements SpaceRepository {
  constructor(
    @InjectRepository(SpaceEntity)
    private readonly spaceRepository: Repository<SpaceEntity>,
  ) {}

  async save(space: Space): Promise<number> {
    const entity = await this.spaceRepository
      .createQueryBuilder()
      .insert()
      .into(SpaceEntity)
      .values({
        name: space.name,
        logoImageUrl: space.logoImageUrl,
        accessCode: space.accessCode,
        adminAccessCode: space.adminAccessCode,
        userIndex: space.userIndex,
        isUse: space.isUse === true ? SpaceEntityIsUse.YES : SpaceEntityIsUse.NO,
        registerDateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      })
      .execute();

    return entity.raw.insertId;
  }

  async findOneByOptions(options: SpaceRepositoryFindOneByOptions): Promise<Space | null> {
    const { id } = options;

    let whereClause = `1=1`;

    if (id) {
      whereClause += ` AND space.cs_index = ${id}`;
    }

    const entity = await this.spaceRepository
      .createQueryBuilder(`space`)
      .innerJoinAndSelect(`space.spaceRole`, 'spaceRole')
      .innerJoinAndSelect(`space.spaceUser`, 'spaceUser')
      .leftJoinAndSelect(`space.post`, 'post')
      .orderBy(`space.cs_index`, `ASC`)
      .orderBy(`post.cp_index`, `ASC`)
      .where(whereClause)
      .getOne();

    return entity ? MysqlSpaceRepositoryMapper.toDomain(entity) : null;
  }

  async findByOptions(options: SpaceRepositoryFindByOptions): Promise<Space[]> {
    const { userId } = options;

    let whereClause = `1=1`;

    if (userId) {
      whereClause += ` AND space.cs_user_index = ${userId}`;
    }

    const entities = await this.spaceRepository
      .createQueryBuilder(`space`)
      .innerJoinAndSelect(`space.spaceRole`, 'spaceRole')
      .innerJoinAndSelect(`space.spaceUser`, 'spaceUser')
      .leftJoinAndSelect(`space.post`, 'post')
      .where(whereClause)
      .orderBy(`space.cs_index`, `ASC`)
      .orderBy(`post.cp_index`, `ASC`)
      .getMany();

    return entities ? MysqlSpaceRepositoryMapper.toDomains(entities) : [];
  }

  async delete(space: Space): Promise<void> {
    await this.spaceRepository
      .createQueryBuilder()
      .update<SpaceEntity>(SpaceEntity, {
        isUse: SpaceEntityIsUse.NO,
        deleteDateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      })
      .where(`index = ${space.id}`)
      .execute();
  }
}
