import { useContext } from 'react';
import { TenantThemeContext } from '@/contexts/TenantThemeProvider';

export function useTenantTheme() {
  const ctx = useContext(TenantThemeContext);
  if (!ctx) {
    throw new Error('useTenantTheme must be used within TenantThemeProvider');
  }
  return ctx;
}
