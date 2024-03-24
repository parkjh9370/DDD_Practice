import { SpaceUser } from 'src/space/domain/SpaceUser';
import { SpaceUserEntity, SpaceUserEntityHasAdministratorRights, SpaceUserEntityIsCreateSpaceUser, SpaceUserEntityIsParticipating } from 'src/space/infrastructure/entity/SpaceUserEntity';

export class MysqlSpaceUserRepositoryMapper {
  static toDomain(entity: SpaceUserEntity): SpaceUser {
    return SpaceUser.create(
      {
        spaceIndex: entity.spaceIndex,
        userIndex: entity.userIndex,
        role: entity.role,
        hasAdministratorRights: entity.hasAdministratorRights === SpaceUserEntityHasAdministratorRights.YES ? true : false,
        isCreateSpaceUser: entity.isCreateSpaceUser === SpaceUserEntityIsCreateSpaceUser.YES ? true : false,
        isParticipating: entity.isParticipating === SpaceUserEntityIsParticipating.YES ? true : false,
      },
      entity.index,
    ).value;
  }

  static toDomains(entities: SpaceUserEntity[]): SpaceUser[] {
    return entities.map((entity) => {
      return this.toDomain(entity);
    });
  }
}
