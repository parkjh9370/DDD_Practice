import { BadRequestException, Inject } from '@nestjs/common';

import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { UseCase } from 'src/shared/core/application/UseCase';
import { POST_REPOSITORY, PostRepository } from 'src/post/infrastructure/PostRepository';
import { SPACE_REPOSITORY, SpaceRepository } from 'src/space/infrastructure/SpaceRepository';
import { DeletePostUseCaseRequest } from './dto/DeletePostUseCaseRequest';
import { DeletePostUseCaseResponse } from './dto/DeletePostUseCaseResponse';

export class DeletePostUseCase implements UseCase<DeletePostUseCaseRequest, DeletePostUseCaseResponse> {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
    @Inject(SPACE_REPOSITORY)
    private readonly spaceRepository: SpaceRepository,
  ) {}

  async execute(request: DeletePostUseCaseRequest): Promise<DeletePostUseCaseResponse> {
    const { userId, spaceId, postId } = request;

    const space = await this.spaceRepository.findOneByOptions({ id: spaceId });

    const spaceUser = space.spaceUsers.filter((spaceUser) => spaceUser.userIndex === userId);
    if (spaceUser.length === 0) {
      throw new BadRequestException('유효하지 못한 접근입니다.');
    }

    const post = await this.postRepository.findOneByOptions({ id: postId });

    const isCreatePostUser = post.userIndex === userId;
    const isAdministratorInSpace = spaceUser[0].hasAdministratorRights;

    if (isCreatePostUser === false && !isAdministratorInSpace) {
      throw new BadRequestException('게시글을 삭제할 수 있는 권한이 없습니다.');
    }

    await this.postRepository.delete(post);

    return { code: RESPONSE_CODE.SUCCESS };
  }
}
