import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json());

  // API Endpoint: Send message directly to Telegram Bot API
  app.post('/api/send-telegram', async (req, res) => {
    try {
      const { name, phone, email, subject, message, botToken, chatId } = req.body;

      const activeToken = botToken || process.env.TELEGRAM_BOT_TOKEN;
      const activeChatId = chatId || process.env.TELEGRAM_CHAT_ID;

      if (!activeToken || !activeChatId) {
        return res.status(400).json({
          ok: false,
          error: 'MISSING_CREDENTIALS',
          message: 'Telegram Bot Token yoki Chat ID kiritilmagan.',
        });
      }

      const text = `🚀 *Yangi xabar (Sarvarbek Portfolio)*\n\n👤 *Ism va familiya:* ${name}\n📞 *Telefon:* ${phone || "Ko'rsatilmagan"}\n✉️ *Email:* ${email}\n📌 *Mavzu:* ${subject}\n\n💬 *Xabar matni:*\n${message}\n\n---\n🌐 *Portfolio saytidan yuborildi*`;

      const response = await fetch(
        `https://api.telegram.org/bot${activeToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: activeChatId,
            text,
            parse_mode: 'Markdown',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        return res.status(400).json({
          ok: false,
          error: data.description || 'Telegram Bot API xatolik qaytardi',
        });
      }

      return res.json({ ok: true, data });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Server xatoligi';
      console.error('Telegram bot send error:', errorMessage);
      return res.status(500).json({
        ok: false,
        error: errorMessage,
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  // Vite integration
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
