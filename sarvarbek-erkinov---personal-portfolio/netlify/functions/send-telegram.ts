// Netlify Serverless Function for Telegram Bot notification
// Handles POST /api/send-telegram

export const handler = async (event: {
  httpMethod: string;
  body: string | null;
}) => {
  // CORS & Preflight handling
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'ok' }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: 'Method Not Allowed' }),
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { name, phone, email, subject, message, botToken, chatId } = payload;

    const activeToken = botToken || process.env.TELEGRAM_BOT_TOKEN;
    const activeChatId = chatId || process.env.TELEGRAM_CHAT_ID;

    if (!activeToken || !activeChatId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          ok: false,
          error: 'MISSING_CREDENTIALS',
          message: 'Telegram Bot Token yoki Chat ID kiritilmagan.',
        }),
      };
    }

    const text = `🚀 *Yangi xabar (Sarvarbek Portfolio)*\n\n👤 *Ism va familiya:* ${name}\n📞 *Telefon:* ${phone || "Ko'rsatilmagan"}\n✉️ *Email:* ${email}\n📌 *Mavzu:* ${subject}\n\n💬 *Xabar matni:*\n${message}\n\n---\n🌐 *https://sarvarbek-portfolio.netlify.app orqali yuborildi*`;

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
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          ok: false,
          error: data.description || 'Telegram Bot API xatolik qaytardi',
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, data }),
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Serverless xatolik';
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: errorMsg }),
    };
  }
};
