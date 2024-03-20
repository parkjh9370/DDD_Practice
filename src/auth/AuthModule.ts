import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { config } from 'src/config/config';

/** Repository Implementations */
import { USER_REPOSITORY } from 'src/user/infrastructure/UserRepository';
import { MysqlUserRepository } from 'src/user/infrastructure/mysql/MysqlUserRepository';

/** Entity */
import { UserEntity } from 'src/user/infrastructure/entity/UserEntity';

/** UseCases */
import { JwtAccessStrategyUseCase } from './application/JwtStrategyUseCase/JwtAccessStrategyUseCase/JwtAccessStrategyUseCase';
import { JwtRefreshStrategyUseCase } from './application/JwtStrategyUseCase/JwtRefreshStrategyUseCase/JwtRefreshStrategyUseCase';
import { SignInUseCase } from './application/SignInUseCase/SignInUseCase';
import { IssueTokenUseCase } from './application/IssueTokenUseCase/IssueTokenUseCase';

/** Controllers */
import { AuthController } from './presentation/AuthController';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: config.JWT.ACCESS_KEY,
      signOptions: {
        expiresIn: config.JWT.ACCESS_KEY_EXPIRED_IN,
      },
    }),
    TypeOrmModule.forFeature([
      UserEntity,
    ]),
  ],
  exports: [],
  controllers: [AuthController],
  providers: [
    JwtAccessStrategyUseCase,
    JwtRefreshStrategyUseCase,
    SignInUseCase,
    IssueTokenUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: MysqlUserRepository,
    },
  ],
})
export class AuthModule {}
