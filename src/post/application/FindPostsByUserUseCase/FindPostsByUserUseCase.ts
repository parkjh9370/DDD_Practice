import { Inject } from '@nestjs/common';

import { UseCase } from 'src/shared/core/application/UseCase';
import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { PostType } from 'src/post/domain/Post';
import { SPACE_REPOSITORY, SpaceRepository } from 'src/space/infrastructure/SpaceRepository';
import { POST_REPOSITORY, PostRepository } from 'src/post/infrastructure/PostRepository';
import { FindPostsByUserUseCaseRequest } from './dto/FindPostsByUserUseCaseRequest';
import { FindPostsByUserUseCaseResponse } from './dto/FindPostsByUserUseCaseResponse';

export type PostsByUser = {
  space: ParticipatingSpace;
  posts: PostDetail[];
};

type ParticipatingSpace = {
  spaceId: number;
  name: string;
  isUse: boolean;
};

type PostDetail = {
  postId: number;
  name: string;
  type: PostType;
  contents: string;
};

export class FindPostsByUserUseCase implements UseCase<FindPostsByUserUseCaseRequest, FindPostsByUserUseCaseResponse> {
  constructor(
    @Inject(SPACE_REPOSITORY)
    private readonly spaceRepository: SpaceRepository,
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
  ) {}

  async execute(request: FindPostsByUserUseCaseRequest): Promise<FindPostsByUserUseCaseResponse> {
    const posts = await this.postRepository.findByOptions({ userId: request.userId });

    const postsByUser: PostsByUser[] = [];
    for (const post of posts) {
      if (post.isUse === false) {
        continue;
      }

      const space = await this.spaceRepository.findOneByOptions({ id: post.spaceIndex });
      const postByUser = {
        space: {
          spaceId: space.id,
          name: space.name,
          isUse: space.isUse,
        },
        posts: [],
      };

      const postDetail: PostDetail = {
        postId: post.id,
        name: post.name,
        type: post.type,
        contents: post.contents,
      };

      postByUser.posts.push(postDetail);
      postsByUser.push(postByUser);
    }

    return { code: RESPONSE_CODE.SUCCESS, posts: postsByUser };
  }
}
