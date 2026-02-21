import { RmqOptions, Transport } from '@nestjs/microservices';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

export function getRabbitMQOptions(queue: string): RmqOptions {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL],
      queue,
      queueOptions: {
        durable: true,
      },
    },
  };
}
