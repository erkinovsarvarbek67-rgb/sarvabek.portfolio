import { Project, ProjectCategory } from '../types/portfolio';

export interface ContactFormValues {
  name: string;
  phone?: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
}

/**
 * Validates the contact form inputs
 */
export function validateContactForm(
  values: ContactFormValues,
  lang: 'uz' | 'en' | 'ru' = 'uz'
): { isValid: boolean; errors: ContactFormErrors } {
  const errors: ContactFormErrors = {};

  const messages = {
    uz: {
      nameRequired: 'Iltimos, ismingizni kiriting (kamida 2 ta belgi)',
      emailRequired: 'Email manzilini kiriting',
      emailInvalid: 'Yaroqli email manzilini kiriting (masalan, name@domain.com)',
      subjectRequired: 'Mavzuni kiriting (kamida 3 ta belgi)',
      messageRequired: 'Xabar matnini kiriting (kamida 10 ta belgi)',
      phoneInvalid: 'Iltimos, to‘g‘ri telefon raqamini kiriting (masalan, +998 90 123 45 67)',
    },
    en: {
      nameRequired: 'Please enter your name (at least 2 characters)',
      emailRequired: 'Please enter your email',
      emailInvalid: 'Please enter a valid email address (e.g. name@domain.com)',
      subjectRequired: 'Please enter a subject (at least 3 characters)',
      messageRequired: 'Please enter a message (at least 10 characters)',
      phoneInvalid: 'Please enter a valid phone number (e.g. +998 90 123 45 67)',
    },
    ru: {
      nameRequired: 'Пожалуйста, введите ваше имя (не менее 2 символов)',
      emailRequired: 'Пожалуйста, введите адрес электронной почты',
      emailInvalid: 'Введите корректный email (например, name@domain.com)',
      subjectRequired: 'Пожалуйста, укажите тему (не менее 3 символов)',
      messageRequired: 'Пожалуйста, введите текст сообщения (не менее 10 символов)',
      phoneInvalid: 'Пожалуйста, введите корректный номер телефона',
    },
  }[lang];

  if (!values.name || values.name.trim().length < 2) {
    errors.name = messages.nameRequired;
  }

  if (!values.email || !values.email.trim()) {
    errors.email = messages.emailRequired;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email.trim())) {
      errors.email = messages.emailInvalid;
    }
  }

  if (values.phone && values.phone.trim().length > 0) {
    const phoneDigits = values.phone.replace(/[^0-9+]/g, '');
    if (phoneDigits.length < 7) {
      errors.phone = messages.phoneInvalid;
    }
  }

  if (!values.subject || values.subject.trim().length < 3) {
    errors.subject = messages.subjectRequired;
  }

  if (!values.message || values.message.trim().length < 10) {
    errors.message = messages.messageRequired;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Formats a direct Telegram message link to open in @coder701
 */
export function formatTelegramDirectLink(
  username: string,
  values: ContactFormValues
): string {
  const cleanUsername = username.replace(/^@/, '');
  const text = `Salom Sarvarbek! Shaxsiy portfolio veb-saytingiz orqali xabar:

👤 Ism: ${values.name}
📞 Telefon: ${values.phone || "Ko'rsatilmagan"}
✉️ Email: ${values.email}
📌 Mavzu: ${values.subject}

💬 Xabar:
${values.message}

---
🌐 Yuborildi: Sarvarbek Erkinov Portfolio`;

  return `https://t.me/${cleanUsername}?text=${encodeURIComponent(text)}`;
}

/**
 * Filters projects by selected category and optional search query
 */
export function filterProjects(
  projects: Project[],
  category: ProjectCategory,
  query: string = ''
): Project[] {
  const normalizedQuery = query.toLowerCase().trim();

  return projects.filter((project) => {
    const matchesCategory = category === 'all' || project.category === category;
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;

    const matchesTitle = project.title.toLowerCase().includes(normalizedQuery);
    const matchesTags = project.tags.some((tag) =>
      tag.toLowerCase().includes(normalizedQuery)
    );
    const matchesDesc = Object.values(project.description).some((desc) =>
      desc.toLowerCase().includes(normalizedQuery)
    );

    return matchesTitle || matchesTags || matchesDesc;
  });
}

/**
 * Generates a random aesthetic hex color with high saturation and balance
 */
export function generateRandomAestheticColor(): string {
  const hues = [210, 240, 270, 310, 180, 150, 330];
  const hue = hues[Math.floor(Math.random() * hues.length)] + (Math.random() * 20 - 10);
  const saturation = 70 + Math.random() * 25; // 70-95%
  const lightness = 45 + Math.random() * 20; // 45-65%

  return hslToHex(hue, saturation, lightness);
}

/**
 * Generates a harmonious palette of N colors
 */
export function generatePalette(count: number = 5): string[] {
  const baseHue = Math.floor(Math.random() * 360);
  const step = 360 / Math.max(count, 1);
  const palette: string[] = [];

  for (let i = 0; i < count; i++) {
    const currentHue = (baseHue + i * (step * 0.75)) % 360;
    const saturation = 65 + (i % 3) * 10;
    const lightness = 50 + ((i * 7) % 25);
    palette.push(hslToHex(currentHue, saturation, lightness));
  }

  return palette;
}

/**
 * Converts HSL values to a 6-character hex color string (#rrggbb)
 */
export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };

  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Constructs a CSS gradient string
 */
export function buildCssGradient(
  type: 'linear' | 'radial',
  angle: number,
  color1: string,
  color2: string,
  color3?: string
): string {
  if (type === 'radial') {
    return color3
      ? `radial-gradient(circle at center, ${color1} 0%, ${color2} 55%, ${color3} 100%)`
      : `radial-gradient(circle at center, ${color1} 0%, ${color2} 100%)`;
  }
  return color3
    ? `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`
    : `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
}

/**
 * Creates a prefilled mailto link with encoded parameters
 */
export function formatMailtoLink(
  recipient: string,
  subject: string,
  name: string,
  userEmail: string,
  message: string,
  phone?: string
): string {
  const fullBody = `Salom Sarvarbek,\n\nIsmim: ${name}\nTelefonim: ${phone || "Ko'rsatilmagan"}\nMening emailim: ${userEmail}\n\nXabar:\n${message}\n\n---\nPortfolio veb-sayti orqali yuborildi`;
  return `mailto:${recipient}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(fullBody)}`;
}
