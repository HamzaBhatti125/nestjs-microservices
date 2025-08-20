import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const config = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: config.get('PORT_TCP'),
    },
  });
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  await app.listen(config.get('PORT_HTTP') || 3005);
}
bootstrap();
