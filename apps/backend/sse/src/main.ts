
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

let clients: { id: number; res: Response }[] = [];
let eventId = 0;

app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now();
  clients.push({ id: clientId, res });

  req.on('close', () => {
    clients = clients.filter(client => client.id !== clientId);
  });
});

function sendEventToClients(data: any, eventName = 'message') {
  clients.forEach(client => {
    client.res.write(`id: ${++eventId}\n`);
    client.res.write(`event: ${eventName}\n`);
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

setInterval(() => {
  sendEventToClients({
    timestamp: new Date().toISOString(),
    value: Math.random() * 100
  });
}, 3000);

app.listen(3000, () => {
  console.log('SSE server running on port 3000');
});

