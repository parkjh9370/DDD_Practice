import { SpaceRole } from 'src/space/domain/SpaceRole';
import { SpaceRoleEntity, SpaceRoleEntityHasAdministratorRights, SpaceRoleEntityIsUse } from 'src/space/infrastructure/entity/SpaceRoleEntity';

export class MysqlSpaceRoleRepositoryMapper {
  static toDomain(entity: SpaceRoleEntity): SpaceRole {
    return SpaceRole.create(
      {
        spaceIndex: entity.spaceIndex,
        role: entity.role,
        hasAdministratorRights: entity.hasAdministratorRights === SpaceRoleEntityHasAdministratorRights.YES ? true : false,
        isUse: entity.isUse === SpaceRoleEntityIsUse.YES ? true : false,
      },
      entity.index,
    ).value;
  }

  static toDomains(entities: SpaceRoleEntity[]): SpaceRole[] {
    return entities.map((entity) => {
      return this.toDomain(entity);
    });
  }
}
