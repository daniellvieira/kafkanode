const express = require('express');
const { CompressionTypes } = require('kafkajs');

const routes = express.Router();
const topic = 'certificate';

routes.post('/certifications', async (req, res) => {
  const message = {
    user: { id: 1, name: 'Neymar Junior' },
    course: 'Kafka com Node.js',
    grade: 10,
  };

  await req.producer.connect();
  await req.producer.send({
    topic,
    compression: CompressionTypes.GZIP,
    messages: [
      { value: JSON.stringify(message) },
      {
        value: JSON.stringify({
          ...message,
          user: { ...message.user, id: 2, name: 'Daniel Fernandes Vieira' },
        }),
      },
    ],
  });
  await req.producer.disconnect();

  return res.json({ ok: true });
});

module.exports = routes;
