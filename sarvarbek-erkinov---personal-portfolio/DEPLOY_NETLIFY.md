# Netlify Deploy Qollanmasi: sarvarbek-portfolio.netlify.app

Saytingiz Netlify platformasida to'liq ishlashi uchun barcha konfiguratsiyalar yaratildi:
1. `netlify.toml` — Build va SPA redirect qoidalari
2. `public/_redirects` — 404 xatolarining oldini oluvchi SPA routing
3. `netlify/functions/send-telegram.ts` — Telegram xabarlarini serverless tarzda xavfsiz yetkazib berish
4. `dist/` — Tayyor va optimallashgan ishlab chiqarish (production) kodi

---

## 1-Usul: Eng oson va tezkor usul (Netlify Drop)
1. Brauzerda [app.netlify.com/drop](https://app.netlify.com/drop) havolasini oching.
2. Netlify hisobingizga kiring (yoki bepul ro'yxatdan o'ting).
3. Ushbu loyihadagi tayyor `dist` papkasini brauzer oynasiga tashlang (Drag & Drop).
4. Saytingiz 10 soniyada jonli efirga chiqadi!

### Sayt nomini `sarvarbek-portfolio.netlify.app` qilish:
- Netlify boshqaruv panelida ochilgan saytingiz sahifasiga o'ting.
- **Site configuration** (yoki **Site settings**) bo'limiga kiring.
- **Change site name** tugmasini bosing.
- Maydonga `sarvarbek-portfolio` deb yozing va **Save** tugmasini bosing.
- Saytingiz rasmiy manzili: **https://sarvarbek-portfolio.netlify.app** bo'ladi.

---

## 2-Usul: GitHub orqali (Avtomatik yangilanish)
1. Ushbu loyihani GitHub repozitoriyangizga joylang (`git push`).
2. Netlify panelida **"Add new site" -> "Import an existing project"** ni tanlang.
3. GitHub-dagi o'z repozitoriyangizni tanlang.
4. Barcha sozlamalar avtomatik `netlify.toml` faylidan olinadi:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Deploy site** tugmasini bosing.
6. Sayt sozlamalaridan nomini `sarvarbek-portfolio` deb o'zgartiring.

---

## Telegram Bot Sozlamalari (Netlify-da)
Sayt orqali kelgan barcha buyurtma va xabarlar Telegram botingizga borishi uchun:
- Netlify-da **Site configuration** -> **Environment variables** bo'limiga kiring.
- Quyidagi 2 ta o'zgaruvchini qo'shing:
  - `TELEGRAM_BOT_TOKEN`: Sizning botingiz tokeni (masalan: `123456789:ABCdefGhI...`)
  - `TELEGRAM_CHAT_ID`: Sizning shaxsiy Telegram ID raqamingiz
- Agar muhit o'zgaruvchilarini qo'shmasangiz ham, saytning o'zida mijoz birinchi marta xabar yuborayotganda sozlash oynasi orqali yoki to'g'ridan-to'g'ri Telegram orqali bog'lanish imkoniyati to'liq saqlangan!
