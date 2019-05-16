import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    options: { port: 3000 },
    transport: Transport.TCP,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.listen(() =>
    // tslint:disable-next-line:no-console
    console.log('Auth microservice is listening [ Auth Module ]'),
  );
}
// tslint:disable-next-line: no-floating-promises
bootstrap();
