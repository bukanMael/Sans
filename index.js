const { Client } = require('whatsapp-web.js');
const axios = require('axios');
const qrcode = require('qrcode-terminal');

// Membuat instance client WhatsApp
const client = new Client();

// Event saat bot berhasil terhubung
client.on('ready', () => {
  console.log('Bot is ready!');
});

// Event saat bot menerima pesan
client.on('message', async (message) => {
  if (message.body.startsWith('.ai ')) {
    const query = message.body.slice(4); // Mengambil teks setelah ".ai " dalam pesan
    const response = await getChatGPTResponse(query);

    // Mengirimkan respons ChatGPT ke pengirim pesan WhatsApp
    message.reply(response);
  }
});

// Fungsi untuk memanggil ChatGPT API menggunakan Axios
async function getChatGPTResponse(query) {
  const apiKey = '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'; // Ganti dengan API key ChatGPT Anda
  const apiUrl = 'https://api.openai.com/v1/chat/completions'; // URL API ChatGPT

  try {
    const response = await axios.post(apiUrl, {
      model: 'gpt-3.5-turbo', // Ganti dengan model ChatGPT yang sesuai
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: query }],
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.choices[0].message.content; // Mengambil respons teks dari ChatGPT
  } catch (error) {
    console.error('Error:', error.message);
    return 'Maaf, terjadi kesalahan dalam memproses permintaan Anda.';
  }
}

client.on('qr', (qr) => {
    console.log('Scan the QR code below to log in:');
    qrcode.generate(qr, { small: true });
  });

// Menjalankan bot dengan memulai sesi WhatsApp Web
client.initialize();
