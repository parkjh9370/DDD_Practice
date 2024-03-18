import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './AppModule';
import { config } from './config/config';
import { HttpLoggingInterceptor } from './shared/interceptors/HttpLoggingInterceptor';

async function bootstrap() {
  process.env.TZ = 'Asia/Seoul';

  const app = await NestFactory.create(AppModule);

  // Swagger
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Classum PreTest') //
    .setVersion('0.1')
    .setDescription('Classum Back-end Engineer PreTest API Specification')
    .addBearerAuth()
    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('docs', app, document, customOptions);

  if (config.NODE_ENV === 'development') {
    app.useGlobalInterceptors(new HttpLoggingInterceptor());
  }

  await app.listen(config.PORT);

  const startLog =
    config.NODE_ENV === 'development' || config.NODE_ENV === 'local_production'
      ? `✅ Server on http://localhost:${config.PORT}` //
      : `✅ Server on port ${config.PORT}`;

  console.info(startLog);
  console.info(`
RUNNING ENV: ${config.NODE_ENV}
RUNNING MYSQL DB HOST: ${config.MYSQL.HOST}
  `);
}
bootstrap();
