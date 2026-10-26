import { Product, CheckoutSettings, AdminAuth } from '../types';

export const DEFAULT_QR_CODE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" fill="%230c0c0e" rx="12"/><rect x="25" y="25" width="45" height="45" fill="none" stroke="%23c59b57" stroke-width="5" rx="4"/><rect x="35" y="35" width="25" height="25" fill="%23c59b57"/><rect x="130" y="25" width="45" height="45" fill="none" stroke="%23c59b57" stroke-width="5" rx="4"/><rect x="140" y="35" width="25" height="25" fill="%23c59b57"/><rect x="25" y="130" width="45" height="45" fill="none" stroke="%23c59b57" stroke-width="5" rx="4"/><rect x="35" y="140" width="25" height="25" fill="%23c59b57"/><g fill="%23dfb776"><rect x="85" y="30" width="10" height="25"/><rect x="105" y="45" width="12" height="12"/><rect x="85" y="85" width="30" height="30"/><rect x="30" y="85" width="15" height="15"/><rect x="55" y="90" width="18" height="12"/><rect x="135" y="85" width="15" height="30"/><rect x="160" y="90" width="15" height="15"/><rect x="85" y="130" width="12" height="40"/><rect x="110" y="145" width="30" height="12"/><rect x="150" y="135" width="25" height="25"/></g><text x="100" y="190" text-anchor="middle" fill="%23dfb776" font-family="sans-serif" font-size="10" font-weight="bold" letter-spacing="1">JAZZCASH PAY</text></svg>`;

export const DEFAULT_CATEGORIES: string[] = ['Cybersecurity', 'Roadmaps', 'Masterclasses'];

export const TEMPLATE_PRODUCTS: Product[] = [
  {
    id: 'prod-mega-bundle',
    title: 'The Digital Warrior & Cyber-Dominance Mega-Bundle',
    category: 'Cybersecurity',
    shortDescription: 'The complete offensive cybersecurity and digital sovereignty arsenal. Comprehensive elite toolkits, red team playbooks, and exploit analysis framework.',
    fullDescription: 'The pinnacle digital asset package from DIVA LABS. Includes 140+ hours of advanced adversarial red teaming, secure infrastructure hardening, reverse engineering, exploit development, and operational security masterclasses. Includes private blueprints, direct command templates, and cloud lab access instructions.',
    priceRs: 999,
    iconPreset: 'shield',
    badge: 'BESTSELLER',
    createdAt: Date.now() - 300000,
  },
  {
    id: 'prod-hacking-blueprint',
    title: 'The Ultimate Zero-to-Advanced Hacking & Offensive Security Blueprint',
    category: 'Cybersecurity',
    shortDescription: 'Structured step-by-step offensive methodology from ground zero to advanced penetration testing and network infiltration.',
    fullDescription: 'Architected for practitioners aiming to attain elite tier offensive capabilities. Covering network reconnaissance, privilege escalation, Active Directory attack graphs, web application exploitation, and bug bounty tradecraft with reproducible lab guides.',
    priceRs: 500,
    iconPreset: 'code',
    badge: 'POPULAR',
    createdAt: Date.now() - 200000,
  },
  {
    id: 'prod-dark-psychology',
    title: 'The Influence & Dark Psychology Vault',
    category: 'Masterclasses',
    shortDescription: 'Executive neuro-persuasion frameworks, behavioral profiling, and cognitive defense strategies for modern leadership.',
    fullDescription: 'Deconstruct psychological patterns, high-stakes negotiation mechanics, influence levers, deception detection, and counter-manipulation tactics deployed in elite business and competitive intelligence circles.',
    priceRs: 500,
    iconPreset: 'eye',
    badge: 'EXCLUSIVE',
    createdAt: Date.now() - 100000,
  },
  {
    id: 'prod-software-engineer',
    title: 'The Elite Software Engineer Roadmap',
    category: 'Roadmaps',
    shortDescription: 'High-frequency distributed systems, performance profiling, scalable architecture blueprints, and principal engineering mindsets.',
    fullDescription: 'The battle-tested architectural roadmap for senior engineers aiming for staff and principal level impact. Deep dives into consensus protocols, zero-latency system design, high-concurrency microservices, and technical leadership.',
    priceRs: 500,
    iconPreset: 'cpu',
    badge: 'FOUNDATIONAL',
    createdAt: Date.now(),
  },
];

export const DEFAULT_CHECKOUT_SETTINGS: CheckoutSettings = {
  accountTitle: '[Aapka Naam Yahan Aayega]',
  accountNumber: '[Aapka JazzCash Number Yahan Aayega]',
  step1: 'Send the payment of the course you are interested in on this number via JazzCash.',
  step2: 'Take a screenshot of the payment and send it on Instagram @diva.ltd along with your Trx ID and the exact product name.',
  step3: 'Send the product name and wait for response to receive your Google Drive access link.',
  showQrCode: false,
  qrCodeUrl: DEFAULT_QR_CODE_SVG,
  instagramHandle: '@diva.ltd',
};

export const DEFAULT_ADMIN_AUTH: AdminAuth = {
  email: 'admin@divalabs.com',
  password: 'admin123',
};
