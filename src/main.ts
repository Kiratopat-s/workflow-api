import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { QueryFailedErrorFilter } from './filters/query-failed-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost)

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new QueryFailedErrorFilter(httpAdapter))

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


