import { SpaceControllerCreateRequestBodyRoles } from 'src/space/presentation/dto/SpaceControllerCreateRequestBody';

export interface CreateSpaceUseCaseRequest {
  userId: number;
  name: string;
  logoImageUrl: string;
  roles: SpaceControllerCreateRequestBodyRoles[];
}
