export interface CreateChatReplyUseCaseRequest {
  chatId: number;
  userId: number;
  postId: number;
  contents: string;
  isAnonymous: boolean;
}
