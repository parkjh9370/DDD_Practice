import { AuthGuard } from '@nestjs/passport';

export const JwtAuthGuard = (
  name: string | string[], //
) => class JwtRefreshGuard extends AuthGuard(name) {};
