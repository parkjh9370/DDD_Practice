import { PostUploadFile } from 'src/post/domain/PostUploadFile';

export const POST_UPLOAD_FILE_REPOSITORY = Symbol('POST_UPLOAD_FILE_REPOSITORY');

export interface PostUploadFileRepository {
  save(post: PostUploadFile): Promise<number>;
}
