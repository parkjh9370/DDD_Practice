import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './AppController';
import { config } from './config/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: config.MYSQL.HOST,
      port: config.MYSQL.PORT as unknown as number,
      username: config.MYSQL.USER,
      password: config.MYSQL.PASSWORD,
      database: 'practice',
      synchronize: false,
      entities: [
        __dirname + '/**/entities/*Entity{.ts,.js}',
        __dirname + '/**/entities/*View{.ts,.js}',
      ],
    }),
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule {}
