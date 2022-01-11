const { Kafka, logLevel } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'certification',
  brokers: ['localhost:9092'],
  logLevel: logLevel.WARN,
});

const consumer = kafka.consumer({ groupId: 'certificate-group' });
const topic = 'certificate';
const topicResponse = 'certificate-response';
const producer = kafka.producer();

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
      console.log(`----> ${prefix} ${message.key}#${message.value}`);

      const payload = JSON.parse(message.value);
      await producer.connect();
      await producer.send({
        topic: topicResponse,
        messages: [
          {
            value: `Certificado do usuário ${payload.user.name} do curso ${payload.course} gerado!`,
          },
        ],
      });
      await producer.disconnect();
    },
  });
}

run().catch(console.error);
