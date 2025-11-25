import { useEffect, useState } from 'react';

interface ConfettiEffectProps {
  active: boolean;
  onComplete?: () => void;
}

export default function ConfettiEffect({ active, onComplete }: ConfettiEffectProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; animationDelay: string; backgroundColor: string }>>([]);

  useEffect(() => {
    if (active) {
      // Gerar confetes
      const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDelay: `${Math.random() * 0.5}s`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      }));
      
      setConfetti(pieces);

      // Limpar após animação
      const timer = setTimeout(() => {
        setConfetti([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active || confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 opacity-90 animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            backgroundColor: piece.backgroundColor,
            animationDelay: piece.animationDelay,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation: confetti-fall 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
