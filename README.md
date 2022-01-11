# Micro-serviço com Node.JS

- Utilizando Kafka
- Utilizando Node

## Fluxo de aplicação

- API Principal (Station)
- Geração de certificados

## Fluxo

- API principal envia um amensagem para o serviço de certificado para gerar um certificado.
- Micro-serviço de certificado devolve uma resposta assíncrona.
- Receber uma resposta assíncrona de quando o e-mail com certificado foi enviado.

## O que sabemos ?

- REST (latência)
- Redis / RabbitMQ / **Kafka**

- Nubank, Uber, Paypal, Netflix

## Como executar ?

Rodar o docker compose:

```javascript
docker-compose up
```

Inicializar a API:

```javascript
cd api; yarn dev
```

Inicializar o microsserviço:

```javascript
cd notification; yarn dev
```

Agora basta fazer uma requisição:

`curl --location --request POST 'http://localhost:3333/certifications'`
