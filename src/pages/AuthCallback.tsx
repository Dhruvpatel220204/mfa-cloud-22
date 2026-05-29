import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      // If Supabase already detected a session from URL/hash, we're done.
      const { data: currentSession } = await supabase.auth.getSession();
      if (currentSession.session) {
        toast.success('Login successful!');
        navigate('/', { replace: true });
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const errorDescription = params.get('error_description');
      const error = params.get('error');
      const code = params.get('code');

      if (error || errorDescription) {
        toast.error(errorDescription || error || 'OAuth sign-in failed');
        navigate('/auth', { replace: true });
        return;
      }

      if (!code) {
        toast.error('Missing OAuth code. Please try again.');
        navigate('/auth', { replace: true });
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        toast.error(exchangeError.message || 'Failed to complete Google sign-in');
        navigate('/auth', { replace: true });
        return;
      }

      toast.success('Login successful!');
      navigate('/', { replace: true });
    };

    run();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Completing Google sign-in…</p>
      </div>
    </div>
  );
}

