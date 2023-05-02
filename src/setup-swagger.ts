import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../package.json';
//import * as fs from 'fs';

export function setupSwagger(app: INestApplication): void {
  const ENV = process.env.NODE_ENV;
  const docPrefix = ENV == 'production' ? '3ee83102fd2158ca4821c3f3f22ee098/' : '';

  const options = new DocumentBuilder()
    .setTitle('API ' + ENV)
    .setVersion(version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`${docPrefix}documentation`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    }
  });
}

export function setupSwaggerClient(app: INestApplication): void {
  const ENV = process.env.NODE_ENV;
  const docPrefix = ENV == 'production' ? '3ee83102fd2158ca4821c3f3f22ee098/' : '';

  const options = new DocumentBuilder()
    .setTitle('Client API')
    .setVersion(version)
    .addBearerAuth()
    .addTag('hotel')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${docPrefix}documentation-client`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    }
  });
}

export function setupSwaggerInjourney(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Injourney API')
    .setVersion(version)
    //.addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('1CgggQy8di3f/injourney-docs', app, document);
}