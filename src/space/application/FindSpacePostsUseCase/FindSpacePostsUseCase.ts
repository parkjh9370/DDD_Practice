import { BadRequestException, Inject } from '@nestjs/common';

import { UseCase } from 'src/shared/core/application/UseCase';
import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { PostType } from 'src/post/domain/Post';
import { USER_REPOSITORY, UserRepository } from 'src/user/infrastructure/UserRepository';
import { SPACE_REPOSITORY, SpaceRepository } from 'src/space/infrastructure/SpaceRepository';
import { FindSpacePostsUseCaseRequest } from './dto/FindSpacePostsUseCaseRequest';
import { FindSpacePostsUseCaseResponse } from './dto/FindSpacePostsUseCaseResponse';

export type SpacePost = {
  userId: number | null;
  userName: string | null;
  name: string | null;
  type: PostType;
  isAnonymous: boolean;
  isCreateUser: boolean;
};

export class FindSpacePostsUseCase implements UseCase<FindSpacePostsUseCaseRequest, FindSpacePostsUseCaseResponse> {
  constructor(
    @Inject(SPACE_REPOSITORY)
    private readonly spaceRepository: SpaceRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: FindSpacePostsUseCaseRequest): Promise<FindSpacePostsUseCaseResponse> {
    const space = await this.spaceRepository.findOneByOptions({ id: request.spaceId });
    if (!space) {
      throw new BadRequestException('유효하지 못한 접근입니다.');
    }

    const spaceUser = space.spaceUsers.filter((spaceUser) => spaceUser.userIndex === request.userId)[0];
    if (!spaceUser) {
      throw new BadRequestException('공간에 참여하지 않은 유저는 조회할 수 없습니다.');
    }

    const hasAdministratorRights = spaceUser.hasAdministratorRights;

    const spacePosts: SpacePost[] = [];
    for (const post of space.posts) {
      if (!post.isUse) {
        continue;
      }
      const isCreatePostUser = post.userIndex === request.userId;

      const isCanViewAnonymousPostUser = hasAdministratorRights || isCreatePostUser;

      const spacePost: SpacePost = {
        userId: isCanViewAnonymousPostUser || !post.isAnonymous ? post.userIndex : null,
        userName: isCanViewAnonymousPostUser || !post.isAnonymous ? (await this.userRepository.findOneByOptions({ id: post.userIndex })).fullName : null,
        name: post.name,
        type: post.type,
        isAnonymous: post.isAnonymous,
        isCreateUser: post.userIndex === request.userId,
      };

      spacePosts.push(spacePost);
    }

    return { code: RESPONSE_CODE.SUCCESS, spacePosts: spacePosts };
  }
}
