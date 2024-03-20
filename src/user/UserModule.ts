import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/** Repository Implementations */
import { USER_REPOSITORY } from './infrastructure/UserRepository';
import { MysqlUserRepository } from './infrastructure/mysql/MysqlUserRepository';

/** Entities */
import { UserEntity } from './infrastructure/entity/UserEntity';

/** Controllers */
import { UserController } from './presentation/UserController';

/** UseCases */
import { CreateUserUseCase } from './application/CreateUserUseCase/CreateUserUseCase';
import { FindOneUserUseCase } from './application/FindOneUserUseCase/FindOneUserUseCase';
import { UpdateUserUseCase } from './application/UpdateUserUseCase/UpdateUserUseCase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
    ]),
  ],
  exports: [UserModule],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    FindOneUserUseCase,
    UpdateUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: MysqlUserRepository,
    },
  ],
})
export class UserModule {}
