export type SectorId = 'default' | 'finance' | 'healthcare' | 'saas' | 'government';
export type BackgroundMode = 'abstract' | 'minimal' | 'video';

export interface TenantFeature {
  title: string;
  desc: string;
}

export interface TenantStat {
  value: string;
  label: string;
}

export interface TenantStep {
  num: string;
  title: string;
  desc: string;
}

export interface TenantColors {
  primary: string;
  accent: string;
  bg: string;
  fg: string;
  muted: string;
  card: string;
  border: string;
}

export interface TenantContent {
  heroBadge: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroSubtitle: string;
  featuresSectionLabel: string;
  featuresTitle: string;
  featuresSubtitle: string;
  flowLabel: string;
  flowTitle: string;
  flowSubtitle: string;
  securityTitle: string;
  securitySubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  authTagline: string;
}

export interface TenantTheme {
  id: string;
  sector: SectorId;
  brandName: string;
  productName: string;
  tagline: string;
  version: string;
  colors: TenantColors;
  backgroundMode: BackgroundMode;
  videoSrc?: string;
  content: TenantContent;
  features: TenantFeature[];
  stats: TenantStat[];
  steps: TenantStep[];
  compliance: string[];
}

const BASE_FEATURES: TenantFeature[] = [
  { title: 'Device Fingerprinting', desc: 'Browser, OS, and hardware signals for precise device recognition and trust binding.' },
  { title: 'Adaptive Trust Scoring', desc: 'Dynamic risk scores from login patterns, device reputation, and behavioral anomalies.' },
  { title: 'TOTP / Authenticator MFA', desc: 'Time-based OTP compatible with Google Authenticator, Authy, and FIDO-aligned apps.' },
  { title: 'SMS & Email OTP', desc: 'Configurable fallback channels with expiry windows and retry policies.' },
  { title: 'Biometric Authentication', desc: 'WebAuthn / FIDO2 for passkeys, fingerprint, and platform authenticators.' },
  { title: 'Geo-Location Monitoring', desc: 'IP geolocation and impossible-travel detection for suspicious access.' },
];

const BASE_STATS: TenantStat[] = [
  { value: '99.97%', label: 'Uptime SLA' },
  { value: '<50ms', label: 'Auth Latency' },
  { value: '256-bit', label: 'AES Encryption' },
  { value: '10M+', label: 'Auth Events/Day' },
];

const BASE_STEPS: TenantStep[] = [
  { num: '01', title: 'User Initiates Login', desc: 'Credentials submitted over TLS 1.3 encrypted channel.' },
  { num: '02', title: 'Device Fingerprint Check', desc: 'Signals matched against trusted device registry.' },
  { num: '03', title: 'Risk Assessment', desc: 'Trust score from location, device age, and login history.' },
  { num: '04', title: 'MFA Challenge', desc: 'Secondary factor when risk threshold or new device is detected.' },
  { num: '05', title: 'Session Granted', desc: 'Secure session issued with continuous monitoring.' },
];

const BASE_COMPLIANCE = ['TLS 1.3', 'AES-256', 'FIDO2', 'OAuth 2.0', 'OpenID Connect', 'SAML 2.0', 'Zero Trust', 'SOC 2'];

function content(partial: Partial<TenantContent>): TenantContent {
  return {
    heroBadge: 'Enterprise-Grade Security',
    heroTitle: 'Multi Factor Cloud',
    heroTitleAccent: 'Authentication',
    heroSubtitle:
      'Adaptive identity platform with device fingerprinting, real-time risk analysis, and seamless multi-factor verification.',
    featuresSectionLabel: 'Authentication Services',
    featuresTitle: 'Comprehensive Security Suite',
    featuresSubtitle:
      'Every authentication layer designed to protect identities without adding friction.',
    flowLabel: 'Authentication Flow',
    flowTitle: 'How It Works',
    flowSubtitle: 'A five-step adaptive pipeline that balances security with speed.',
    securityTitle: 'Enterprise Security Standards',
    securitySubtitle:
      'Zero-trust architecture, end-to-end encryption, and continuous threat monitoring for regulated environments.',
    ctaTitle: 'Ready to Secure Your Platform?',
    ctaSubtitle: 'Deploy multi-factor cloud authentication in minutes. No infrastructure overhead.',
    authTagline: 'Secure sign-in to your organization',
    ...partial,
  };
}

export const SECTOR_PRESETS: Record<SectorId, Omit<TenantTheme, 'id'>> = {
  default: {
    sector: 'default',
    brandName: 'MFCA',
    productName: 'Multi Factor Cloud Authentication',
    tagline: 'Adaptive Cloud Authentication Platform',
    version: 'v2.0',
    colors: {
      primary: '199 89% 48%',
      accent: '217 91% 60%',
      bg: '222 47% 7%',
      fg: '210 40% 96%',
      muted: '215 16% 58%',
      card: '222 40% 11%',
      border: '217 32% 20%',
    },
    backgroundMode: 'abstract',
    content: content({}),
    features: BASE_FEATURES,
    stats: BASE_STATS,
    steps: BASE_STEPS,
    compliance: BASE_COMPLIANCE,
  },
  finance: {
    sector: 'finance',
    brandName: 'MFCA',
    productName: 'Secure Banking Access',
    tagline: 'Regulated financial identity & fraud prevention',
    version: 'v2.0',
    colors: {
      primary: '217 91% 55%',
      accent: '43 74% 52%',
      bg: '222 47% 6%',
      fg: '210 40% 96%',
      muted: '215 14% 55%',
      card: '222 38% 10%',
      border: '217 28% 22%',
    },
    backgroundMode: 'minimal',
    content: content({
      heroBadge: 'PCI & SOC 2 Ready',
      heroTitle: 'Trusted Financial',
      heroTitleAccent: 'Authentication',
      heroSubtitle:
        'Stop account takeover with adaptive MFA, device trust, and real-time fraud signals built for banks and fintech.',
      featuresTitle: 'Bank-Grade Identity Controls',
      featuresSubtitle: 'Controls aligned with financial fraud teams and compliance auditors.',
      securitySubtitle:
        'Meet regulatory expectations with audit trails, encryption, and zero-trust session policies.',
      ctaTitle: 'Protect Every Transaction',
      ctaSubtitle: 'Roll out MFA across retail, corporate, and partner portals from one platform.',
      authTagline: 'Authorized access to financial systems',
    }),
    features: [
      { title: 'Fraud Signal Scoring', desc: 'Real-time risk from device, velocity, and behavioral anomalies.' },
      ...BASE_FEATURES.slice(1, 4),
      { title: 'Audit & Compliance Logs', desc: 'Immutable login events for regulators and internal security teams.' },
      { title: 'Partner API Access', desc: 'OAuth 2.0 / OpenID Connect for B2B and open-banking integrations.' },
    ],
    stats: BASE_STATS,
    steps: BASE_STEPS,
    compliance: ['PCI DSS', 'SOC 2', 'TLS 1.3', 'AES-256', 'FIDO2', 'OAuth 2.0', 'Zero Trust', 'ISO 27001'],
  },
  healthcare: {
    sector: 'healthcare',
    brandName: 'MFCA',
    productName: 'HIPAA-Aligned Access',
    tagline: 'Protected health information access control',
    version: 'v2.0',
    colors: {
      primary: '185 62% 42%',
      accent: '199 70% 50%',
      bg: '200 30% 8%',
      fg: '180 20% 96%',
      muted: '195 12% 55%',
      card: '200 28% 11%',
      border: '185 22% 22%',
    },
    backgroundMode: 'abstract',
    content: content({
      heroBadge: 'HIPAA-Aligned Controls',
      heroTitle: 'Clinical-Grade',
      heroTitleAccent: 'Identity Security',
      heroSubtitle:
        'Secure clinician, staff, and patient-portal access with MFA tuned for healthcare workflows and privacy rules.',
      featuresTitle: 'Healthcare Identity Suite',
      securitySubtitle:
        'Safeguard PHI with strong authentication, session controls, and continuous access monitoring.',
      authTagline: 'Sign in to protected health systems',
    }),
    features: [
      { title: 'Role-Based MFA Policies', desc: 'Different assurance levels for clinicians, admins, and patients.' },
      ...BASE_FEATURES.slice(1, 5),
      { title: 'Session Timeout Controls', desc: 'Automatic lockout aligned with clinical workstation policies.' },
    ],
    stats: BASE_STATS,
    steps: BASE_STEPS,
    compliance: ['HIPAA', 'HITECH', 'TLS 1.3', 'AES-256', 'FIDO2', 'OAuth 2.0', 'SOC 2', 'Zero Trust'],
  },
  saas: {
    sector: 'saas',
    brandName: 'MFCA',
    productName: 'Cloud Identity Platform',
    tagline: 'SSO & MFA for modern SaaS products',
    version: 'v2.0',
    colors: {
      primary: '199 89% 48%',
      accent: '262 80% 62%',
      bg: '224 40% 7%',
      fg: '210 40% 96%',
      muted: '215 16% 58%',
      card: '224 35% 11%',
      border: '224 28% 20%',
    },
    backgroundMode: 'abstract',
    content: content({
      heroBadge: 'Built for SaaS Scale',
      heroTitle: 'Developer-Ready',
      heroTitleAccent: 'Cloud MFA',
      heroSubtitle:
        'Embed adaptive authentication in your product with APIs, webhooks, and tenant-level branding out of the box.',
      ctaSubtitle: 'Ship MFA in days—not months—with white-label ready components.',
      authTagline: 'Sign in to your workspace',
    }),
    features: BASE_FEATURES,
    stats: BASE_STATS,
    steps: BASE_STEPS,
    compliance: BASE_COMPLIANCE,
  },
  government: {
    sector: 'government',
    brandName: 'MFCA',
    productName: 'Citizen Identity Gateway',
    tagline: 'Secure public-sector authentication',
    version: 'v2.0',
    colors: {
      primary: '214 32% 52%',
      accent: '199 50% 45%',
      bg: '220 20% 9%',
      fg: '210 25% 94%',
      muted: '215 12% 52%',
      card: '220 18% 12%',
      border: '214 18% 24%',
    },
    backgroundMode: 'minimal',
    content: content({
      heroBadge: 'FedRAMP-Ready Architecture',
      heroTitle: 'Sovereign',
      heroTitleAccent: 'Digital Identity',
      heroSubtitle:
        'High-assurance authentication for agencies and public services with auditability and data residency controls.',
      featuresTitle: 'Public-Sector Security Modules',
      securitySubtitle:
        'Meet government security baselines with strong MFA, device trust, and centralized policy enforcement.',
      authTagline: 'Authorized government system access',
    }),
    features: [
      { title: 'High-Assurance MFA', desc: 'Phishing-resistant factors for privileged and citizen-facing portals.' },
      ...BASE_FEATURES.slice(1, 4),
      { title: 'Central Policy Engine', desc: 'Uniform auth rules across departments and legacy applications.' },
      { title: 'Audit & Attribution', desc: 'Full traceability for security operations and oversight bodies.' },
    ],
    stats: BASE_STATS,
    steps: BASE_STEPS,
    compliance: ['NIST 800-63', 'FIPS 140-2', 'TLS 1.3', 'AES-256', 'FIDO2', 'SAML 2.0', 'Zero Trust', 'SOC 2'],
  },
};

export const SECTOR_OPTIONS: { id: SectorId; label: string }[] = [
  { id: 'default', label: 'Security' },
  { id: 'finance', label: 'Finance' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'saas', label: 'SaaS' },
  { id: 'government', label: 'Government' },
];

export function isSectorId(value: string | null): value is SectorId {
  return value !== null && value in SECTOR_PRESETS;
}

export function buildTenantTheme(sector: SectorId, overrides?: Partial<TenantTheme>): TenantTheme {
  const preset = SECTOR_PRESETS[sector];
  return {
    id: overrides?.id ?? `tenant-${sector}`,
    ...preset,
    ...overrides,
    colors: { ...preset.colors, ...overrides?.colors },
    content: { ...preset.content, ...overrides?.content },
    features: overrides?.features ?? preset.features,
    stats: overrides?.stats ?? preset.stats,
    steps: overrides?.steps ?? preset.steps,
    compliance: overrides?.compliance ?? preset.compliance,
  };
}

export function resolveSectorFromEnv(): SectorId {
  const raw = import.meta.env.VITE_TENANT_SECTOR as string | undefined;
  return isSectorId(raw ?? null) ? raw : 'default';
}

export function resolveTenantTheme(sector: SectorId): TenantTheme {
  const preset = buildTenantTheme(sector);
  const brandName = import.meta.env.VITE_TENANT_BRAND_NAME as string | undefined;
  const productName = import.meta.env.VITE_TENANT_PRODUCT_NAME as string | undefined;
  const primary = import.meta.env.VITE_TENANT_PRIMARY as string | undefined;
  const accent = import.meta.env.VITE_TENANT_ACCENT as string | undefined;
  const bgMode = import.meta.env.VITE_TENANT_BACKGROUND as string | undefined;

  const backgroundMode: BackgroundMode =
    bgMode === 'video' || bgMode === 'minimal' || bgMode === 'abstract' ? bgMode : preset.backgroundMode;

  return buildTenantTheme(sector, {
    brandName: brandName || preset.brandName,
    productName: productName || preset.productName,
    backgroundMode,
    videoSrc: backgroundMode === 'video' ? '/videos/landing-bg.mp4' : undefined,
    colors: {
      ...preset.colors,
      ...(primary ? { primary } : {}),
      ...(accent ? { accent } : {}),
    },
  });
}
