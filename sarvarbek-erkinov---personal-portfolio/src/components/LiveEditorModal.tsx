import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  X,
  Save,
  RotateCcw,
  Download,
  Sliders,
  CheckCircle,
} from 'lucide-react';

export const LiveEditorModal: React.FC = () => {
  const {
    lang,
    data,
    updateData,
    resetData,
    isEditorOpen,
    setIsEditorOpen,
    t,
    playSfx,
  } = usePortfolio();

  const [formName, setFormName] = useState(data.name);
  const [formTagline, setFormTagline] = useState(data.heroTagline[lang] || '');
  const [formBio, setFormBio] = useState(data.aboutBio[lang] || '');
  const [formEmail, setFormEmail] = useState(data.contacts.email);
  const [formPhone, setFormPhone] = useState(data.contacts.phoneDisplay || '+998 50 786 20 10');
  const [formTelegram, setFormTelegram] = useState(data.contacts.telegramUsername || 'coder701');
  const [formBotToken, setFormBotToken] = useState(data.contacts.telegramBotToken || '');
  const [formChatId, setFormChatId] = useState(data.contacts.telegramChatId || '');
  const [formGithub, setFormGithub] = useState(data.contacts.githubUsername);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Close on ESC
  React.useEffect(() => {
    if (!isEditorOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditorOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditorOpen, setIsEditorOpen]);

  if (!isEditorOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playSfx('success');

    updateData({
      name: formName,
      initials: formName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'SE',
      heroTagline: {
        ...data.heroTagline,
        [lang]: formTagline,
      },
      aboutBio: {
        ...data.aboutBio,
        [lang]: formBio,
      },
      contacts: {
        ...data.contacts,
        email: formEmail,
        phone: formPhone.replace(/[^0-9+]/g, '') || '+998507862010',
        phoneDisplay: formPhone,
        telegramUsername: formTelegram.replace(/^@/, '') || 'coder701',
        telegramUrl: `https://t.me/${formTelegram.replace(/^@/, '') || 'coder701'}`,
        telegramBotToken: formBotToken,
        telegramChatId: formChatId,
        githubUsername: formGithub,
        githubUrl: `https://github.com/${formGithub}`,
      },
    });

    setFeedback(t.editor.savedSuccess);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleReset = () => {
    playSfx('toggle');
    resetData();
    setFeedback(t.editor.resetSuccess);
    setTimeout(() => {
      setFeedback(null);
      setIsEditorOpen(false);
    }, 1200);
  };

  const handleExportJson = () => {
    playSfx('click');
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'portfolio-config.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={() => setIsEditorOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="editor-modal-title"
    >
      <div
        className="relative w-full max-w-2xl my-auto rounded-3xl bg-[#0c0f1e] border border-violet-500/40 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 id="editor-modal-title" className="text-lg font-bold text-white">
                {t.editor.title}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {t.editor.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSfx('click');
              setIsEditorOpen(false);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
            aria-label={t.editor.closeBtn}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {feedback && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">
              {t.editor.nameLabel}
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">
              {t.editor.taglineLabel} ({lang.toUpperCase()})
            </label>
            <input
              type="text"
              value={formTagline}
              onChange={(e) => setFormTagline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">
              {t.editor.aboutBioLabel} ({lang.toUpperCase()})
            </label>
            <textarea
              rows={3}
              value={formBio}
              onChange={(e) => setFormBio(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          {/* Contacts Row: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">
                {t.editor.emailLabel}
              </label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">
                Telefon raqam
              </label>
              <input
                type="tel"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="+998 50 786 20 10"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Telegram Username & GitHub Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">
                {t.editor.telegramLabel}
              </label>
              <input
                type="text"
                value={formTelegram}
                onChange={(e) => setFormTelegram(e.target.value)}
                placeholder="coder701"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">
                {t.editor.githubLabel}
              </label>
              <input
                type="text"
                value={formGithub}
                onChange={(e) => setFormGithub(e.target.value)}
                placeholder="erkinovsarvarbek"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Telegram Bot Notification Settings (Optional) */}
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <span className="text-[11px] font-mono text-cyan-400 font-semibold block">
              🤖 Telegram Bot Avtomatik Xabar Sozlamalari (Ixtiyoriy)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400">
                  Bot Token (masalan: 123456:ABC-DEF...)
                </label>
                <input
                  type="password"
                  value={formBotToken}
                  onChange={(e) => setFormBotToken(e.target.value)}
                  placeholder="BotFather bergan token"
                  className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.06] text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400">
                  Chat ID (masalan: 987654321)
                </label>
                <input
                  type="text"
                  value={formChatId}
                  onChange={(e) => setFormChatId(e.target.value)}
                  placeholder="Shaxsiy yoki guruh chat ID si"
                  className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.06] text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-lg transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t.editor.saveBtn}</span>
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium border border-white/[0.08] transition-all"
                title="JSON fayl sifatida saqlab olish"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.editor.exportJsonBtn}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs font-mono transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.editor.resetBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
