import { BadRequestException, Inject } from '@nestjs/common';

import { RESPONSE_CODE } from 'src/shared/core/application/CoreResponse';
import { UseCase } from 'src/shared/core/application/UseCase';
import { Post, PostType } from 'src/post/domain/Post';
import { PostUploadFile } from 'src/post/domain/PostUploadFile';
import { POST_REPOSITORY, PostRepository } from 'src/post/infrastructure/PostRepository';
import { SPACE_REPOSITORY, SpaceRepository } from 'src/space/infrastructure/SpaceRepository';
import { POST_UPLOAD_FILE_REPOSITORY, PostUploadFileRepository } from 'src/post/infrastructure/PostUploadFileRepository';
import { CreatePostUseCaseRequest } from './dto/CreatePostUseCaseRequest';
import { CreatePostUseCaseResponse } from './dto/CreatePostUseCaseResponse';

export class CreatePostUseCase implements UseCase<CreatePostUseCaseRequest, CreatePostUseCaseResponse> {
  constructor(
    @Inject(POST_REPOSITORY) //
    private readonly postRepository: PostRepository,
    @Inject(POST_UPLOAD_FILE_REPOSITORY)
    private readonly postUploadFileRepository: PostUploadFileRepository,
    @Inject(SPACE_REPOSITORY)
    private readonly spaceRepository: SpaceRepository,
  ) {}

  async execute(request: CreatePostUseCaseRequest): Promise<CreatePostUseCaseResponse> {
    const space = await this.spaceRepository.findOneByOptions({ id: request.spaceId });
    if (!space) {
      throw new BadRequestException('해당 Space를 찾을 수 없습니다.');
    }

    const spaceUser = space.spaceUsers.filter((spaceUser) => spaceUser.userIndex === request.userId);
    if (spaceUser.length === 0) {
      throw new BadRequestException('Space에 참여하지 않은 유저입니다.');
    }

    if (spaceUser[0].hasAdministratorRights === false && request.type === PostType.NOTICE) {
      throw new BadRequestException('공지를 작성할 수 있는 권한이 없습니다.');
    }

    if (spaceUser[0].hasAdministratorRights === true && request.isAnonymous === true) {
      throw new BadRequestException('공지글은 익명으로 작성할 수 없습니다.');
    }

    const post = Post.createNew({
      spaceIndex: request.spaceId,
      name: request.name,
      type: request.type,
      contents: request.contents,
      userIndex: request.userId,
      isAnonymous: request.isAnonymous,
      isUse: true,
    }).value;

    const insertedPostIndex = await this.postRepository.save(post);

    if (request.fileUrls === null) {
      return { code: RESPONSE_CODE.SUCCESS, id: insertedPostIndex };
    }

    for (const fileUrl of request.fileUrls) {
      const postFileUrl = PostUploadFile.createNew({
        postIndex: insertedPostIndex,
        fileUrl: fileUrl.url,
        isUse: true,
      }).value;

      await this.postUploadFileRepository.save(postFileUrl);
    }

    return { code: RESPONSE_CODE.SUCCESS, id: insertedPostIndex };
  }
}
