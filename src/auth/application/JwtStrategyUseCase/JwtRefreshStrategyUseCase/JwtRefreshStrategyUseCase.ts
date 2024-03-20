import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { config } from 'src/config/config';
import { USER_REPOSITORY, UserRepository } from 'src/user/infrastructure/UserRepository';

@Injectable()
export class JwtRefreshStrategyUseCase extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: (req: { headers: { cookie: string } }) => {
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace('refreshToken=', '');

        return refreshToken;
      },
      secretOrKey: config.JWT.REFRESH_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req: { headers: { cookie: string } }, payload: { sub: number }) {
    const cookie = req.headers.cookie;
    const refreshToken = cookie.replace('refreshToken=', '');

    const user = await this.userRepository.findOneByOptions({ id: payload.sub });

    if (refreshToken !== user.refreshToken) {
      throw new UnauthorizedException('Unauthorized access');
    }

    return user.id;
  }
}
