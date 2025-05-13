import qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import { askGPT } from './ai.js';
import './server.js'; 

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ WhatsApp bot is ready!');
});

client.on('message', async msg => {
  console.log(`📩 Message received: ${msg.body}`);

  if (msg.body.startsWith('/ai ')) {
    const prompt = msg.body.replace('/ai ', '');

    try {
      const reply = await askGPT(prompt); 
      msg.reply(reply);
    } catch (err) {
      console.error("❌ OpenAI error:", err.message);
      msg.reply("Something went wrong while fetching a response.");
    }
  }
});

client.initialize();
