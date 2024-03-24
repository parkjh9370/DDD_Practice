import { Space } from 'src/space/domain/Space';
import { SpaceRole } from 'src/space/domain/SpaceRole';
import { SpaceUser } from 'src/space/domain/SpaceUser';
import { Post, PostType } from 'src/post/domain/Post';
import { SpaceEntity, SpaceEntityIsUse } from 'src/space/infrastructure/entity/SpaceEntity';
import { SpaceRoleEntityHasAdministratorRights, SpaceRoleEntityIsUse } from 'src/space/infrastructure/entity/SpaceRoleEntity';
import { SpaceUserEntityHasAdministratorRights, SpaceUserEntityIsCreateSpaceUser, SpaceUserEntityIsParticipating } from 'src/space/infrastructure/entity/SpaceUserEntity';
import { PostEntityIsAnonymous, PostEntityIsUse } from 'src/post/infrastructure/entity/PostEntity';

export class MysqlSpaceRepositoryMapper {
  static toDomain(entity: SpaceEntity): Space {
    return Space.create(
      {
        name: entity.name,
        logoImageUrl: entity.logoImageUrl,
        accessCode: entity.accessCode,
        adminAccessCode: entity.adminAccessCode,
        userIndex: entity.userIndex,
        isUse: entity.isUse === SpaceEntityIsUse.YES ? true : false,
        spaceRoles: entity.spaceRole.map(
          (spaceRole) =>
            SpaceRole.create(
              {
                spaceIndex: spaceRole.spaceIndex,
                role: spaceRole.role,
                hasAdministratorRights: spaceRole.hasAdministratorRights === SpaceRoleEntityHasAdministratorRights.YES ? true : false,
                isUse: spaceRole.isUse === SpaceRoleEntityIsUse.YES ? true : false,
              },
              spaceRole.index,
            ).value,
        ),
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
        posts: entity.post.map(
          (post) =>
            Post.create(
              {
                spaceIndex: post.spaceIndex,
                name: post.name,
                type: post.type as PostType,
                contents: post.contents,
                userIndex: post.userIndex,
                isAnonymous: post.isAnonymous === PostEntityIsAnonymous.YES ? true : false,
                isUse: post.isUse === PostEntityIsUse.YES ? true : false,
              },
              post.index,
            ).value,
        ),
      },
      entity.index,
    ).value;
  }

  static toDomains(entities: SpaceEntity[]): Space[] {
    return entities.map((entity) => {
      return this.toDomain(entity);
    });
  }
}
