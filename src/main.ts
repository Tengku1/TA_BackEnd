import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { customValidationPipe } from './custom-validation-pipe';
import { setupSwagger, setupSwaggerClient, setupSwaggerInjourney } from './setup-swagger';
import { json } from 'express';
import { QueryFailedErrorFilter } from './common/exception-filters/query-failed-error.filter';
import { EntityNotFoundFilter } from './common/exception-filters/entity-not-found.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.use(json({ limit: '20mb' }));

  // enable cors
  app.enableCors();

  app.useGlobalFilters(new QueryFailedErrorFilter());
  app.useGlobalFilters(new EntityNotFoundFilter());

  // Request Validation
  app.useGlobalPipes(customValidationPipe({ whitelist: true, transform: true }));

  // Swagger API Documentation
  setupSwagger(app);
  setupSwaggerClient(app);
  setupSwaggerInjourney(app);

  const PORT = process.env.PORT || 3000;
  try {
    await app.listen(PORT);
    Logger.log(`Express is working on port ${PORT}`, 'Main');
  } catch (error) {
    Logger.error(error.message, 'Main');
    throw error;
  }
}
bootstrap();
