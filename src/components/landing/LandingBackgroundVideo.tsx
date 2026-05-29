import { useCallback, useEffect, useRef, useState } from 'react';

export const DEFAULT_BG_VIDEO = '/videos/landing-bg.mp4';
interface LandingBackgroundVideoProps {
  src?: string;
}

export default function LandingBackgroundVideo({ src = DEFAULT_BG_VIDEO }: LandingBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(true);

  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {
        const resume = () => {
          video.play().catch(() => {});
          document.removeEventListener('pointerdown', resume);
        };
        document.addEventListener('pointerdown', resume, { once: true });
      });
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !visible) return;

    const onReady = () => {
      document.documentElement.classList.add('shell-video-active');
      tryPlay();
    };

    video.addEventListener('loadeddata', onReady);
    video.addEventListener('canplay', onReady);
    if (video.readyState >= 2) onReady();

    return () => {
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('canplay', onReady);
      document.documentElement.classList.remove('shell-video-active');
    };
  }, [visible, tryPlay]);

  if (!visible) return null;

  return (
    <div className="shell-bg-video-wrap" aria-hidden>
      <video
        ref={videoRef}
        className="shell-bg-video"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onError={() => {
          document.documentElement.classList.remove('shell-video-active');
          setVisible(false);
        }}
      />
    </div>
  );
}
