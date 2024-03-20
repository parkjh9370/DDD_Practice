import { User } from 'src/user/domain/User';
import { SpaceUser } from 'src/space/domain/SpaceUser';
import { SpaceUserEntityHasAdministratorRights, SpaceUserEntityIsCreateSpaceUser, SpaceUserEntityIsParticipating } from 'src/space/infrastructure/entity/SpaceUserEntity';
import { UserEntity, UserEntityIsAdmin, UserEntityIsUse } from 'src/user/infrastructure/entity/UserEntity';

export class MysqlUserRepositoryMapper {
  static toDomain(entity: UserEntity): User {
    return User.create(
      {
        lastName: entity.lastName,
        firstName: entity.firstName,
        email: entity.email,
        password: entity.password,
        profileImageUrl: entity.profileImageUrl,
        isAdmin: entity.isAdmin === UserEntityIsAdmin.YES ? true : false,
        isUse: entity.isUse === UserEntityIsUse.YES ? true : false,
        refreshToken: entity.refreshToken,
        refreshTokenExpirationDateTime: entity.refreshTokenExpirationDateTime,
        spaceUsers: entity.spaceUser.map(
          (spaceUser) =>
            SpaceUser.create(
              {
                spaceIndex: spaceUser.spaceIndex,
                userIndex: spaceUser.userIndex,
                role: spaceUser.role,
                hasAdministratorRights: spaceUser.hasAdministratorRights === SpaceUserEntityHasAdministratorRights.YES ? true : false,
                isCreateSpaceUser: spaceUser.isCreateSpaceUser === SpaceUserEntityIsCreateSpaceUser.YES ? true : false,
                isParticipating: spaceUser.isParticipating === SpaceUserEntityIsParticipating.YES ? true : false,
              },
              spaceUser.index,
            ).value,
        ),
      },
      entity.index,
    ).value;
  }

  static toDomains(entities: UserEntity[]): User[] {
    return entities.map((entity) => {
      return this.toDomain(entity);
    });
  }
}
