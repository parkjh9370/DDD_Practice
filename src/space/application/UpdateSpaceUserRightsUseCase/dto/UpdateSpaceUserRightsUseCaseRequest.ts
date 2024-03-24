export interface UpdateSpaceUserRightsUseCaseRequest {
  spaceId: number;
  userId: number;
  toUpdateUserId: number;
  rights: boolean;
}
