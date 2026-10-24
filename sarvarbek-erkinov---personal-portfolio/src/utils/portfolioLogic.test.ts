import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateContactForm,
  filterProjects,
  hslToHex,
  buildCssGradient,
  formatMailtoLink,
  formatTelegramDirectLink,
  generatePalette,
} from './portfolioLogic';
import { Project } from '../types/portfolio';

test('validateContactForm rejects empty inputs', () => {
  const result = validateContactForm({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.subject);
  assert.ok(result.errors.message);
});

test('validateContactForm rejects invalid emails', () => {
  const result = validateContactForm({
    name: 'Sarvarbek',
    email: 'not-an-email',
    subject: 'Hamkorlik taklifi',
    message: 'Bu yetarlicha uzun xabar matni bo‘ladi.',
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.email);
});

test('validateContactForm accepts valid submission', () => {
  const result = validateContactForm({
    name: 'Alisher',
    email: 'alisher@example.com',
    subject: 'Yangi loyiha loyihasi',
    message: 'Salom, biz siz bilan hamkorlik qilishni xohlaymiz.',
  });

  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
});

test('filterProjects correctly filters by category', () => {
  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'Olimpiada Uz',
      category: 'web',
      status: 'Demo',
      description: { uz: 'Ta’lim', en: 'Education', ru: 'Образование' },
      detailedDescription: { uz: '', en: '', ru: '' },
      features: { uz: [], en: [], ru: [] },
      tags: ['React', 'TypeScript'],
      gradient: '',
      icon: '',
    },
    {
      id: '2',
      title: 'Neon Snake',
      category: 'games',
      status: 'Demo',
      description: { uz: 'Arkad o‘yini', en: 'Arcade game', ru: 'Аркада' },
      detailedDescription: { uz: '', en: '', ru: '' },
      features: { uz: [], en: [], ru: [] },
      tags: ['Canvas', 'JavaScript'],
      gradient: '',
      icon: '',
    },
  ];

  const all = filterProjects(mockProjects, 'all');
  assert.equal(all.length, 2);

  const gamesOnly = filterProjects(mockProjects, 'games');
  assert.equal(gamesOnly.length, 1);
  assert.equal(gamesOnly[0].title, 'Neon Snake');

  const searchTag = filterProjects(mockProjects, 'all', 'typescript');
  assert.equal(searchTag.length, 1);
  assert.equal(searchTag[0].title, 'Olimpiada Uz');
});

test('hslToHex returns valid hex strings', () => {
  assert.equal(hslToHex(0, 0, 0), '#000000');
  assert.equal(hslToHex(0, 0, 100), '#ffffff');
  assert.match(hslToHex(220, 80, 50), /^#[0-9a-f]{6}$/i);
});

test('buildCssGradient formats gradients accurately', () => {
  const linear = buildCssGradient('linear', 45, '#8b5cf6', '#06b6d4');
  assert.equal(linear, 'linear-gradient(45deg, #8b5cf6 0%, #06b6d4 100%)');

  const radial = buildCssGradient('radial', 0, '#ff0055', '#7a00ff');
  assert.equal(radial, 'radial-gradient(circle at center, #ff0055 0%, #7a00ff 100%)');
});

test('generatePalette outputs the requested number of colors', () => {
  const palette = generatePalette(5);
  assert.equal(palette.length, 5);
  palette.forEach((color) => assert.match(color, /^#[0-9a-f]{6}$/i));
});

test('formatMailtoLink constructs valid encoded URL', () => {
  const mailto = formatMailtoLink(
    'test@example.com',
    'Salom!',
    'Ali',
    'ali@test.com',
    'Assalomu alaykum',
    '+998 50 786 20 10'
  );
  assert.ok(mailto.startsWith('mailto:test@example.com?subject=Salom'));
  assert.ok(mailto.includes('Assalomu'));
});

test('formatTelegramDirectLink constructs link to coder701 with message', () => {
  const link = formatTelegramDirectLink('@coder701', {
    name: 'Alisher Vohidov',
    phone: '+998 50 786 20 10',
    email: 'ali@test.com',
    subject: 'Web loyiha',
    message: 'Salom, bizga sayt kerak.',
  });

  assert.ok(link.startsWith('https://t.me/coder701?text='));
  assert.ok(link.includes(encodeURIComponent('Alisher Vohidov')));
  assert.ok(link.includes(encodeURIComponent('+998 50 786 20 10')));
});
