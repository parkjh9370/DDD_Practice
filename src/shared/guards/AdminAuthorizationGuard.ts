import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';

import { config } from 'src/config/config';

@Injectable()
export class AdminAuthorizationGuard implements CanActivate {
  private readonly ADMIN_ACCESS_KEY = config.ADMIN_ACCESS_KEY;

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.headers.accesskey !== this.ADMIN_ACCESS_KEY) {
      throw new BadRequestException('Invalid admin access key');
    }

    return true;
  }
}
