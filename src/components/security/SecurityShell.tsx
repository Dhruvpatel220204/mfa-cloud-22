import { useEffect, type ReactNode } from 'react';
import { useTenantTheme } from '@/hooks/useTenantTheme';
import LandingBackgroundVideo from '@/components/landing/LandingBackgroundVideo';

type ShellRoute = 'landing-route' | 'auth-route';

interface SecurityShellProps {
  children: ReactNode;
  routeClass: ShellRoute;
}

export default function SecurityShell({ children, routeClass }: SecurityShellProps) {
  const { theme } = useTenantTheme();
  const showVideo = theme.backgroundMode === 'video';
  const showAbstract = theme.backgroundMode === 'abstract';

  useEffect(() => {
    document.documentElement.classList.add(routeClass);
    return () => document.documentElement.classList.remove(routeClass);
  }, [routeClass]);

  return (
    <div className="security-shell min-h-screen overflow-x-hidden relative">
      {showVideo && <LandingBackgroundVideo src={theme.videoSrc} />}
      <div className="shell-overlay" aria-hidden />
      {showAbstract && (
        <>
          <div className="shell-grid" aria-hidden />
          <div className="shell-glow shell-glow-a" aria-hidden />
          <div className="shell-glow shell-glow-b" aria-hidden />
        </>
      )}
      <div className="shell-vignette" aria-hidden />
      {children}
    </div>
  );
}
