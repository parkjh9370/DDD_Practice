import { PostType } from 'src/post/domain/Post';

export interface CreatePostUseCaseRequest {
  userId: number;
  spaceId: number;
  name: string;
  type: PostType;
  contents: string;
  isAnonymous: boolean;
  fileUrls:
    | {
        url: string;
      }[]
    | null;
}
