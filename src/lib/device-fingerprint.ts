export interface DeviceInfo {
  browser: string;
  os: string;
  fingerprint: string;
  screenResolution: string;
  timezone: string;
  language: string;
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Unknown';
}

function getOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Windows NT 10')) return 'Windows 10/11';
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS X')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Unknown';
}

function generateFingerprint(info: Omit<DeviceInfo, 'fingerprint'>): string {
  const raw = `${info.browser}-${info.os}-${info.screenResolution}-${info.timezone}-${info.language}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36).toUpperCase();
}

export function getDeviceInfo(): DeviceInfo {
  const partial = {
    browser: getBrowser(),
    os: getOS(),
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
  };

  return {
    ...partial,
    fingerprint: generateFingerprint(partial),
  };
}

export function calculateTrustScore(params: {
  isKnownDevice: boolean;
  loginSuccess: boolean;
  failedAttemptsRecent: number;
  accountAge: number; // in days
}): { score: number; level: 'low' | 'medium' | 'high' | 'critical' } {
  // Simple trust model: 100 base score, minus 1 per failed login attempt.
  // This keeps score changes gradual for all users.
  let score = 100 - params.failedAttemptsRecent;

  score = Math.max(0, Math.min(100, score));

  let level: 'low' | 'medium' | 'high' | 'critical';
  if (score >= 80) level = 'low';
  else if (score >= 60) level = 'medium';
  else if (score >= 40) level = 'high';
  else level = 'critical';

  return { score, level };
}
