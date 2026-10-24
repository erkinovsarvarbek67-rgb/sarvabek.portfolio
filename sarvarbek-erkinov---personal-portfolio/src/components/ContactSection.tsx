import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  validateContactForm,
  formatTelegramDirectLink,
  ContactFormErrors,
  ContactFormValues,
} from '../utils/portfolioLogic';
import {
  Mail,
  Send,
  Copy,
  Check,
  ExternalLink,
  Phone,
  Send as TelegramIcon,
  MapPin,
  AlertCircle,
  Sparkles,
  Bot,
  Settings,
  HelpCircle,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContactSection: React.FC = () => {
  const { lang, data, updateData, t, playSfx } = usePortfolio();

  const [formValues, setFormValues] = useState<ContactFormValues>({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});
  const [formSuccess, setFormSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Bot Config Modal / Drawer
  const [isBotModalOpen, setIsBotModalOpen] = useState(false);
  const [inputBotToken, setInputBotToken] = useState(
    data.contacts.telegramBotToken || ''
  );
  const [inputChatId, setInputChatId] = useState(
    data.contacts.telegramChatId || ''
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof ContactFormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Perform actual dispatch to Telegram Bot
  const dispatchToBot = async (token: string, chatId: string) => {
    setIsSending(true);
    setSendError(null);

    try {
      // 1. Try server-side proxy route first
      let res = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formValues,
          botToken: token,
          chatId: chatId,
        }),
      });

      let json = await res.json().catch(() => null);

      // 2. If proxy route failed or missing, try direct Telegram Bot API
      if (!res.ok || !json?.ok) {
        const text = `🚀 *Yangi xabar (Sarvarbek Portfolio)*\n\n👤 *Ism va familiya:* ${formValues.name}\n📞 *Telefon:* ${formValues.phone || "Ko'rsatilmagan"}\n✉️ *Email:* ${formValues.email}\n📌 *Mavzu:* ${formValues.subject}\n\n💬 *Xabar matni:*\n${formValues.message}\n\n---\n🌐 *Portfolio saytidan yuborildi*`;

        const directRes = await fetch(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text,
              parse_mode: 'Markdown',
            }),
          }
        );

        const directJson = await directRes.json();
        if (!directRes.ok || !directJson.ok) {
          throw new Error(
            directJson?.description || 'Telegram bot xatolik qaytardi. Token va Chat ID ni tekshiring.'
          );
        }
      }

      // Success
      setIsSending(false);
      setFormSuccess(true);
      playSfx('success');
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // confetti fallback
      }
    } catch (err: unknown) {
      setIsSending(false);
      const msg = err instanceof Error ? err.message : 'Xatolik yuz berdi';
      setSendError(msg);
      playSfx('toggle');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSfx('click');

    const validation = validateContactForm(formValues, lang);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});

    const activeToken = data.contacts.telegramBotToken?.trim();
    const activeChatId = data.contacts.telegramChatId?.trim();

    // If bot token or chat ID is not set yet, prompt the user with the setup modal!
    if (!activeToken || !activeChatId) {
      setIsBotModalOpen(true);
      return;
    }

    dispatchToBot(activeToken, activeChatId);
  };

  const handleSaveBotAndSend = (e: React.FormEvent) => {
    e.preventDefault();
    playSfx('click');

    const token = inputBotToken.trim();
    const chat = inputChatId.trim();

    if (!token || !chat) {
      setSendError('Iltimos, Bot Token va Chat ID ni ikkalasini ham kiriting!');
      return;
    }

    // Save to context & localStorage
    updateData({
      contacts: {
        ...data.contacts,
        telegramBotToken: token,
        telegramChatId: chat,
      },
    });

    setIsBotModalOpen(false);
    dispatchToBot(token, chat);
  };

  const handleCopyEmail = () => {
    playSfx('success');
    navigator.clipboard.writeText(data.contacts.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    playSfx('success');
    navigator.clipboard.writeText(data.contacts.phoneDisplay);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const openTelegramDirect = () => {
    playSfx('click');
    const tgLink = formatTelegramDirectLink(data.contacts.telegramUsername, formValues);
    window.open(tgLink, '_blank');
  };

  const hasBotConfigured = Boolean(
    data.contacts.telegramBotToken && data.contacts.telegramChatId
  );

  return (
    <section
      id="contact"
      className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#07080f]"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>{t.contact.sectionBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {t.contact.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
            {t.contact.subtitle}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contacts */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0d101e] border border-white/[0.08] shadow-2xl space-y-5">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>{t.contact.infoBoxTitle}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Yuborilgan har bir xabar to‘g‘ridan-to‘g‘ri <strong className="text-cyan-300 font-mono">Telegram Bot</strong>ingizga yetkaziladi.
                </p>
              </div>

              {/* Bot status pill */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-300">Telegram Bot Holati:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      hasBotConfigured
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {hasBotConfigured ? 'Uланган (Faol)' : 'Sozlash kutilmoqda'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBotModalOpen(true)}
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1 font-mono"
                  title="Bot token va chat id ni sozlash"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Sozlash</span>
                </button>
              </div>

              {/* Telegram Primary Contact Card */}
              <a
                href={data.contacts.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="group p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 hover:border-sky-400/60 flex items-center justify-between gap-3 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform">
                    <TelegramIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-sky-300 block">
                      Telegram Shaxsiy Chat
                    </span>
                    <span className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                      @{data.contacts.telegramUsername}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Phone Contact Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 truncate">
                  <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-[11px] font-mono text-slate-400 block">
                      Telefon raqam
                    </span>
                    <a
                      href={`tel:${data.contacts.phone}`}
                      className="text-xs sm:text-sm font-semibold text-white hover:text-emerald-400 block transition-colors"
                    >
                      {data.contacts.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleCopyPhone}
                    className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-all"
                    title="Telefon raqamini nusxalash"
                    aria-label="Telefon raqamini nusxalash"
                  >
                    {copiedPhone ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href={`tel:${data.contacts.phone}`}
                    className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-all text-xs font-mono"
                    title="Qo‘ng‘iroq qilish"
                  >
                    Qo‘ng‘iroq
                  </a>
                </div>
              </div>

              {/* Email Contact Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 truncate">
                  <div className="p-2.5 rounded-xl bg-violet-600/20 text-violet-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-[11px] font-mono text-slate-400 block">
                      Email Manzil
                    </span>
                    <a
                      href={`mailto:${data.contacts.email}`}
                      className="text-xs sm:text-sm font-semibold text-white hover:text-cyan-400 truncate block transition-colors"
                    >
                      {data.contacts.email}
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-all shrink-0"
                  aria-label={t.contact.copyEmailBtn}
                >
                  {copiedEmail ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Location */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-600/20 text-cyan-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block">
                    Joylashuv
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {data.contacts.location[lang]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0d101e] border border-white/[0.08] shadow-2xl relative">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name & Phone in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      Ism va familiyangiz *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formValues.name}
                      onChange={handleInputChange}
                      placeholder="Masalan: Sarvarbek Erkinov"
                      className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                        formErrors.name
                          ? 'border-rose-500 focus:border-rose-400'
                          : 'border-white/[0.08] focus:border-cyan-400'
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{formErrors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                      <span>Telefon raqamingiz</span>
                      <span className="text-[10px] text-slate-500">Ixtiyoriy</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formValues.phone || ''}
                      onChange={handleInputChange}
                      placeholder="+998 90 123 45 67"
                      className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                        formErrors.phone
                          ? 'border-rose-500 focus:border-rose-400'
                          : 'border-white/[0.08] focus:border-cyan-400'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{formErrors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Email field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">
                    {t.contact.emailLabel} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                    placeholder={t.contact.emailPlaceholder}
                    className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                      formErrors.email
                        ? 'border-rose-500 focus:border-rose-400'
                        : 'border-white/[0.08] focus:border-cyan-400'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{formErrors.email}</span>
                    </p>
                  )}
                </div>

                {/* Subject field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">
                    {t.contact.subjectLabel} *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formValues.subject}
                    onChange={handleInputChange}
                    placeholder={t.contact.subjectPlaceholder}
                    className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                      formErrors.subject
                        ? 'border-rose-500 focus:border-rose-400'
                        : 'border-white/[0.08] focus:border-cyan-400'
                    }`}
                  />
                  {formErrors.subject && (
                    <p className="text-[11px] text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{formErrors.subject}</span>
                    </p>
                  )}
                </div>

                {/* Message field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">
                    {t.contact.messageLabel} *
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    value={formValues.message}
                    onChange={handleInputChange}
                    placeholder={t.contact.messagePlaceholder}
                    className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all resize-none ${
                      formErrors.message
                        ? 'border-rose-500 focus:border-rose-400'
                        : 'border-white/[0.08] focus:border-cyan-400'
                    }`}
                  />
                  {formErrors.message && (
                    <p className="text-[11px] text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{formErrors.message}</span>
                    </p>
                  )}
                </div>

                {/* Send Error Message */}
                {sendError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{sendError}</span>
                  </div>
                )}

                {/* Submit Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {/* Primary Telegram Submit Button */}
                  <button
                    type="submit"
                    disabled={isSending}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-violet-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isSending
                        ? 'Telegram Botga Yuborilmoqda...'
                        : 'Telegram Botga Yuborish'}
                    </span>
                  </button>

                  {/* Direct Telegram Chat Button */}
                  <button
                    type="button"
                    onClick={openTelegramDirect}
                    className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-xs font-medium text-sky-300 hover:text-white hover:bg-sky-500/20 transition-all"
                  >
                    <TelegramIcon className="w-4 h-4 text-sky-400" />
                    <span>@coder701 ga o‘tish</span>
                  </button>

                  {/* Bot settings gear */}
                  <button
                    type="button"
                    onClick={() => setIsBotModalOpen(true)}
                    className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
                    title="Telegram Bot Token va Chat ID ni sozlash"
                  >
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>

                {/* Success Feedback Alert */}
                {formSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <Check className="w-5 h-5 text-emerald-400" />
                      <span>Xabar Telegram botingizga muvaffaqiyatli yetkazildi!</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Telegram botingizni tekshirishingiz mumkin. Shuningdek, xabarni <strong className="text-sky-300">@{data.contacts.telegramUsername}</strong> chatiga ham jo‘natishni xohlasangiz:
                    </p>
                    <button
                      type="button"
                      onClick={openTelegramDirect}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 text-white font-semibold text-xs shadow-md"
                    >
                      <TelegramIcon className="w-3.5 h-3.5" />
                      <span>@coder701 da xabarni ochish</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Telegram Bot Setup Modal */}
      {isBotModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-3xl bg-[#0d1020] border border-cyan-500/40 shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Telegram Bot Sozlamalari
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Xabarlar to‘g‘ridan-to‘g‘ri botingizga kelishi uchun
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBotModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBotAndSend} className="space-y-4">
              {/* Bot Token */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">
                  1. Telegram Bot Token *
                </label>
                <input
                  type="text"
                  required
                  value={inputBotToken}
                  onChange={(e) => setInputBotToken(e.target.value)}
                  placeholder="Masalan: 7123456789:AAH7xYz..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Chat ID */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">
                  2. Sizning Telegram Chat ID *
                </label>
                <input
                  type="text"
                  required
                  value={inputChatId}
                  onChange={(e) => setInputChatId(e.target.value)}
                  placeholder="Masalan: 123456789"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Quick instructions guide */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                  <HelpCircle className="w-4 h-4" />
                  <span>Qanday olinadi? (Juda oson, 1 daqiqa)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
                  <li>
                    Telegramda <strong className="text-white">@BotFather</strong> ga kirib <code className="text-cyan-300 font-mono">/newbot</code> yuboring va Bot Tokenini nusxalang.
                  </li>
                  <li>
                    Telegramda <strong className="text-white">@userinfobot</strong> ga <code className="text-cyan-300 font-mono">/start</code> yuborib, o‘z <strong>Id</strong> raqamingizni oling.
                  </li>
                  <li>
                    O‘zingiz ochgan botga kirib <strong className="text-white">/start</strong> tugmasini bir marta bosing!
                  </li>
                </ol>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBotModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold text-xs shadow-lg"
                >
                  Saqlash va Yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
