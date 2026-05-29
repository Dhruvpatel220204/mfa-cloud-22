import { createContext, useEffect, useMemo, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  type SectorId,
  type TenantTheme,
  isSectorId,
  resolveSectorFromEnv,
  resolveTenantTheme,
} from '@/config/tenantTheme';

interface TenantThemeContextValue {
  theme: TenantTheme;
  sector: SectorId;
  setSectorQuery: (sector: SectorId) => void;
}

export const TenantThemeContext = createContext<TenantThemeContextValue | null>(null);

function applyTenantCssVars(theme: TenantTheme) {
  const root = document.documentElement;
  const { colors } = theme;

  root.style.setProperty('--tenant-primary', colors.primary);
  root.style.setProperty('--tenant-accent', colors.accent);
  root.style.setProperty('--tenant-bg', colors.bg);
  root.style.setProperty('--tenant-fg', colors.fg);
  root.style.setProperty('--tenant-muted', colors.muted);
  root.style.setProperty('--tenant-card', colors.card);
  root.style.setProperty('--tenant-border', colors.border);
  root.dataset.sector = theme.sector;
  root.dataset.bgMode = theme.backgroundMode;
}

function clearTenantCssVars() {
  const root = document.documentElement;
  const keys = ['--tenant-primary', '--tenant-accent', '--tenant-bg', '--tenant-fg', '--tenant-muted', '--tenant-card', '--tenant-border'];
  keys.forEach((k) => root.style.removeProperty(k));
  delete root.dataset.sector;
  delete root.dataset.bgMode;
}

export function TenantThemeProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const querySector = searchParams.get('sector');
  const sector: SectorId = isSectorId(querySector) ? querySector : resolveSectorFromEnv();
  const theme = useMemo(() => resolveTenantTheme(sector), [sector]);

  useEffect(() => {
    applyTenantCssVars(theme);
    return clearTenantCssVars;
  }, [theme]);

  const setSectorQuery = (next: SectorId) => {
    const params = new URLSearchParams(searchParams);
    if (next === 'default') params.delete('sector');
    else params.set('sector', next);
    setSearchParams(params, { replace: true });
  };

  const value = useMemo(
    () => ({ theme, sector, setSectorQuery }),
    [theme, sector, searchParams, setSearchParams],
  );

  return <TenantThemeContext.Provider value={value}>{children}</TenantThemeContext.Provider>;
}
