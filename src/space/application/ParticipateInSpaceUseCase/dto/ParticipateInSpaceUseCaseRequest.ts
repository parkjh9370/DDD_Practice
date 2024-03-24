export interface ParticipateInSpaceUseCaseRequest {
  userId: number;
  spaceId: number;
  accessCode: string;
  role: string;
}
