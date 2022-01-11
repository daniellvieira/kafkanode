const express = require('express');
const { Kafka, logLevel } = require('kafkajs');
const routes = require('./routes');
const app = express();

/**
 * Faz conexão com o Kafka
 */
const kafka = new Kafka({
  clientId: 'api',
  brokers: ['localhost:9092'],
  logLevel: logLevel.WARN,
});

const producer = kafka.producer();
const groupId = 'certificate-group-receiver';
const consumer = kafka.consumer({ groupId });
const topicResponse = 'certificate-response';

/**
 * Disponibiliza o producer para todas rotas
 */
app.use((req, res, next) => {
  req.producer = producer;

  return next();
});

/**
 * Cadastra as rotas da aplicação
 */
app.use(routes);

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: topicResponse, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
      console.log(`[${prefix}] ${message.value}`);
    },
  });

  app.listen(3333);
}

run().catch(console.error);
