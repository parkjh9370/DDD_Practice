import { Post, PostType } from 'src/post/domain/Post';
import { PostUploadFile } from 'src/post/domain/PostUploadFile';
import { PostEntity, PostEntityIsAnonymous, PostEntityIsUse } from '../../entity/PostEntity';
import { PostUploadFileEntityIsUse } from '../../entity/PostUploadFileEntity';

export class MysqlPostRepositoryMapper {
  static toDomain(entity: PostEntity): Post {
    return Post.create(
      {
        spaceIndex: entity.spaceIndex,
        name: entity.name,
        type: entity.type as PostType,
        contents: entity.contents,
        userIndex: entity.userIndex,
        isAnonymous: entity.isAnonymous === PostEntityIsAnonymous.YES ? true : false,
        isUse: entity.isUse === PostEntityIsUse.YES ? true : false,
        postUploadFiles: entity.postUploadFile.map(
          (postUploadFile) =>
            PostUploadFile.create(
              {
                postIndex: postUploadFile.postIndex,
                fileUrl: postUploadFile.fileUrl,
                isUse: postUploadFile.isUse === PostUploadFileEntityIsUse.YES ? true : false,
              },
              postUploadFile.index,
            ).value,
        ),
      },
      entity.index,
    ).value;
  }

  static toDomains(entities: PostEntity[]): Post[] {
    return entities.map((entity) => {
      return this.toDomain(entity);
    });
  }
}
