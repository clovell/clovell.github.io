import React, { useEffect, useRef } from 'react';

interface FeedbackEffectsProps {
  type: 'incorrect' | 'streak' | null;
  streakCount: number;
  onComplete: () => void;
}

const FeedbackEffects: React.FC<FeedbackEffectsProps> = ({ type, streakCount, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Failure Effect: Red Flash
  if (type === 'incorrect') {
    return (
      <div 
        className="fixed inset-0 z-50 pointer-events-none animate-fade-in flex items-center justify-center bg-red-900/30"
        onAnimationEnd={onComplete}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/20 to-transparent mix-blend-overlay" />
      </div>
    );
  }

  // Streak Effect: Confetti Canvas
  if (type === 'streak') {
    return <ConfettiCanvas streakCount={streakCount} onComplete={onComplete} />;
  }

  return null;
};

const ConfettiCanvas: React.FC<{ streakCount: number, onComplete: () => void }> = ({ streakCount, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Configuration based on streak intensity
    const intensity = Math.min(streakCount / 5, 5); // 1 to 5 scale
    const particleCount = 50 + (streakCount * 5);
    const colors = ['#C5A059', '#8B0000', '#F5F5F0', '#FFD700', '#FFFFFF'];
    
    const particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      life: number;
      decay: number;
      rotation: number;
      rotationSpeed: number;

      constructor() {
        this.x = canvas!.width / 2;
        this.y = canvas!.height / 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (10 + intensity * 2);
        
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - (5 + intensity); // Initial upward burst
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 8 + 4;
        this.life = 1.0;
        this.decay = Math.random() * 0.01 + 0.005;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.5; // Gravity
        this.vx *= 0.96; // Air resistance
        this.life -= this.decay;
        this.rotation += this.rotationSpeed;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    // Init particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let activeParticles = 0;
      particles.forEach(p => {
        if (p.life > 0) {
          p.update();
          p.draw(ctx);
          activeParticles++;
        }
      });

      if (activeParticles > 0) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [streakCount, onComplete]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="relative z-10 text-center animate-slide-up">
        <div className="font-display font-bold text-6xl text-roman-gold drop-shadow-lg stroke-black" style={{ textShadow: '2px 2px 0 #000' }}>
           {streakCount} in a Row!
        </div>
        <div className="font-serif italic text-2xl text-white mt-2 drop-shadow-md">
           {streakCount >= 20 ? "Mirabile Visu!" : streakCount >= 10 ? "Optime!" : "Macte Virtute!"}
        </div>
      </div>
    </div>
  );
};

export default FeedbackEffects;