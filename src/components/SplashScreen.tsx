import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if splash has already been shown in this session
    const hasShown = sessionStorage.getItem('splash_shown');
    
    if (hasShown) {
      onFinish();
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('splash_shown', 'true');
      setTimeout(onFinish, 300); // Faster fade-out animation
    }, 500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!isVisible && sessionStorage.getItem('splash_shown')) return null;

  return (
    <div className={`splash-screen ${!isVisible ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <img src={logo} alt="Apna Cafe Logo" className="splash-logo" />
        <h1 className="splash-title">Apna Cafe</h1>
        <div className="splash-loader">
          <div className="loader-bar"></div>
        </div>
      </div>
      
      <style>{`
        .splash-screen {
          position: fixed;
          inset: 0;
          background-color: var(--bg-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          transition: opacity 0.5s ease-out;
        }
        .splash-screen.fade-out {
          opacity: 0;
        }
        .splash-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .splash-logo {
          width: 120px;
          height: auto;
          filter: drop-shadow(0 0 20px var(--primary-glow));
          animation: pulse 2s infinite ease-in-out;
        }
        .splash-title {
          font-family: 'Playfair Display', serif;
          color: var(--text-cream);
          font-size: 2.5rem;
          margin: 0;
          letter-spacing: 2px;
        }
        .splash-loader {
          width: 150px;
          height: 3px;
          background: rgba(245, 235, 224, 0.1);
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        }
        .loader-bar {
          width: 100%;
          height: 100%;
          background: var(--primary);
          position: absolute;
          left: -100%;
          animation: loading 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes loading {
          0% { left: -100%; }
          50% { left: 0; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
