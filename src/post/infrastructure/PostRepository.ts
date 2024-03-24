import { Post } from 'src/post/domain/Post';

export const POST_REPOSITORY = Symbol('POST_REPOSITORY');

export interface PostRepositoryFindOneByOptions {
  id?: number;
}

export interface PostRepositoryFindByOptions {
  userId?: number;
}

export interface PostRepository {
  save(post: Post): Promise<number>;

  findOneByOptions(options: PostRepositoryFindOneByOptions): Promise<Post>;

  findByOptions(options: PostRepositoryFindByOptions): Promise<Post[]>;

  delete(post: Post): Promise<void>;
}
