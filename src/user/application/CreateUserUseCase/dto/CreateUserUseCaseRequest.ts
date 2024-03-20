export interface CreateUserUseCaseRequest {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  profileImageUrl?: string;
  isAdminUser?: boolean;
}
