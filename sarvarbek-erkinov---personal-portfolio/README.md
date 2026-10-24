# Sarvarbek Erkinov — Personal Portfolio Website

Dunyo darajasidagi, zamonaviy, estetik va to‘liq interaktiv shaxsiy portfolio veb-sayti.

- **Dasturchi**: Sarvarbek Erkinov
- **Kasb**: Web Developer, Python Programmer, Creative Technologist
- **Joylashuv**: O‘zbekiston
- **Asosiy til**: O‘zbek tili (Shuningdek, to‘liq English va Русский tillari mavjud)
- **Vizual uslub**: Premium Obsidian Dark Theme, Glassmorphism, Three.js 3D texnologik yadro, Creative Lab interaktiv laboratoriyasi va neon effekti.

---

## 🚀 Ishga Tushirish (Quick Start)

### 1. Bog‘liqliklarni o‘rnatish:
```bash
npm install
```

### 2. Dasturni dev rejimida ishga tushirish:
```bash
npm run dev
```
Brauzeringizda `http://localhost:3000` manzilini oching.

### 3. Production uchun build qilish:
```bash
npm run build
```

---

## 🛠️ Loyiha Xususiyatlari & Arxitekturasi

1. **Three.js 3D Interactive Hero**:
   - PBR materiallar, `RoomEnvironment` studiya akslanishi, 3-point studiya yorug‘ligi.
   - Sichqoncha harakatiga silliq eksponentsial damping orqali javob beruvchi 3D Quantum Core.
   - Quvvatni tejash uchun Software WebGL guard (`isSoftwareGl`).

2. **Ko‘p Tillilik (i18n)**:
   - O‘zbekcha, Inglizcha va Ruscha tillari to‘liq ishlaydi.
   - Tugmalar, tavsiflar, loyihalar va formalar real vaqtda yangilanadi.

3. **Live Content Customizer (Kodni o‘zgartirmasdan tahrirlash)**:
   - Yuqori paneldagi **"Tahrirlash"** tugmasi orqali ism, bio, sarlavha, email, Telegram va GitHub manzillarini brauzerda o‘zgartirish mumkin.
   - O‘zgarishlar `localStorage`da saqlanadi yoki JSON fayl sifatida yuklab olinadi.

4. **Interaktiv Loyihalar & Mini-Arcade**:
   - *Olimpiada Uz*: Ta’lim va test platformasi konsepsiyasi.
   - *MacBook Namangan*: Apple uslubidagi do‘kon va konfigurator.
   - *Neon Snake Arcade*: Brauzerda to‘liq o‘ynaladigan Canvas mini-o‘yini (zarrachalar, ovoz, ochkolar).
   - *Geometry Dash Runner*: Ritmik platformer sakrash simulyatori.
   - *Personal Tools Suite*: Dasturchilar uchun foydali vositalar.

5. **Creative Lab**:
   - Jonli CSS gradient generatori (kodni nusxalash tugmasi bilan).
   - Harmonik 5-rangli palitra yaratuvchi va bir marta bosishda HEX kodni nusxalash.
   - Sichqonchaga javob beruvchi yorug‘lik sathi.

---

## ✉️ Telegram Bot Orqali Xabar Qabul Qilish

Saytda yuborilgan har bir xabar to‘g‘ridan-to‘g‘ri sizning Telegram botingizga boradi:

### Botni sozlash (1 marta qilinadi):
1. Telegramda **@BotFather** ga kiring va `/newbot` buyrug‘ini bering. Bot nomini yozib, **Bot Token**ini oling (masalan: `7123456789:AAH...`).
2. Telegramda **@userinfobot** ga kiring va o‘z **Id** raqamingizni oling (masalan: `123456789`).
3. O‘zingiz yaratgan botga kirib **/start** tugmasini bir marta bosing (aks holda bot sizga xabar yubora olmaydi).
4. Saytingizda **"Telegram Botga Yuborish"** tugmasini bosing yoki **"Sozlash"** belgisini ochib, Token va Chat ID ni kiriting.
5. Tayyor! Endi saytingizdan yuborilgan har bir buyurtma va xabar bir zumda sizning botingizga keladi!

*Shuningdek, mijozlar istasa to‘g‘ridan-to‘g‘ri **@coder701** shaxsiy chatiga ham bir marta bosishda xabarni yo‘llashlari mumkin.*

---

## 🌐 Deploy Qilish Yo‘riqnomasi

### Vercel / Netlify / Cloudflare Pages orqali deploy:
1. GitHub repozitoriyangizga kodni `git push` qiling.
2. Vercel yoki Netlify hisobingizga kirib, repozitoriyani tanlang.
3. Build command: `npm run build`
4. Output directory: `dist`
5. "Deploy" tugmasini bosing — bir necha soniyada saytingiz internetda ishga tushadi!
