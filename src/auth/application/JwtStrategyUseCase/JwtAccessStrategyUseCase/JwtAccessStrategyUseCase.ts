import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { config } from 'src/config/config';
import { USER_REPOSITORY, UserRepository } from 'src/user/infrastructure/UserRepository';

@Injectable()
export class JwtAccessStrategyUseCase extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.JWT.ACCESS_KEY,
    });
  }

  async validate(payload: { sub: number }) {
    const user = await this.userRepository.findOneByOptions({ id: payload.sub });

    if (user) {
      return user.id;
    } else {
      throw new UnauthorizedException('Unauthorized access');
    }
  }
}
