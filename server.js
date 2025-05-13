import { WebSocketServer } from 'ws';
import { askGPT } from './ai.js';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', ws => {
    console.log('🟢 WebSocket client connected');

    ws.on('message', async message => {
        const text = message.toString();
        const reply = await askGPT(text);  // Call askBot function correctly
        ws.send(reply);
    });
});
