export interface CreateChatUseCaseRequest {
  userId: number;
  postId: number;
  contents: string;
  isAnonymous: boolean;
}
