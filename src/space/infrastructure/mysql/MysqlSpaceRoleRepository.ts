import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { SpaceRoleFindByOptions, SpaceRoleRepository } from '../SpaceRoleRepository';
import { SpaceRoleEntity, SpaceRoleEntityHasAdministratorRights, SpaceRoleEntityIsUse } from '../entity/SpaceRoleEntity';
import { SpaceRole } from 'src/space/domain/SpaceRole';
import { MysqlSpaceRoleRepositoryMapper } from './mapper/MysqlSpaceRoleRepositoryMapper';

export class MysqlSpaceRoleRepository implements SpaceRoleRepository {
  constructor(
    @InjectRepository(SpaceRoleEntity)
    private readonly spaceRoleRepository: Repository<SpaceRoleEntity>,
  ) {}

  async save(spaceRole: SpaceRole): Promise<void> {
    await this.spaceRoleRepository //
      .createQueryBuilder()
      .insert()
      .into(SpaceRoleEntity)
      .values({
        spaceIndex: spaceRole.spaceIndex,
        role: spaceRole.role,
        hasAdministratorRights: spaceRole.hasAdministratorRights === true ? SpaceRoleEntityHasAdministratorRights.YES : SpaceRoleEntityHasAdministratorRights.NO,
        isUse: spaceRole.isUse === true ? SpaceRoleEntityIsUse.YES : SpaceRoleEntityIsUse.NO,
        registerDateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      })
      .execute();

    return;
  }

  async findByOptions(options: SpaceRoleFindByOptions): Promise<SpaceRole[]> {
    const { spaceId } = options;

    let whereClause = `1=1`;

    if (spaceId) {
      whereClause += ` AND spaceRole.csr_cs_index = ${spaceId}`;
    }

    const entities = await this.spaceRoleRepository //
      .createQueryBuilder(`spaceRole`)
      .where(whereClause)
      .getMany();

    return entities ? MysqlSpaceRoleRepositoryMapper.toDomains(entities) : [];
  }

  async delete(spaceRole: SpaceRole): Promise<void> {
    await this.spaceRoleRepository
      .createQueryBuilder()
      .update<SpaceRoleEntity>(SpaceRoleEntity, {
        isUse: SpaceRoleEntityIsUse.NO,
        deleteDateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      })
      .where(`index = ${spaceRole.id}`)
      .execute();
  }
}
