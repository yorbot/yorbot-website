
import React, { useEffect, useRef } from "react";

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 0.5; // Size between 0.5 and 3.5
        this.speedX = (Math.random() - 0.5) * 0.3; // Reduced speed for softer movement
        this.speedY = (Math.random() - 0.5) * 0.3; // Reduced speed for softer movement
        this.opacity = Math.random() * 0.4 + 0.1; // Opacity between 0.1 and 0.5
        
        // Color palette - soft colors for dark background
        const colors = [
          'rgba(100, 149, 237, 1)', // Cornflower blue
          'rgba(135, 206, 250, 1)', // Light sky blue
          'rgba(248, 113, 113, 0.5)', // Soft red
          'rgba(251, 146, 60, 0.5)', // Soft orange
          'rgba(140, 140, 140, 0.7)', // Soft white/gray
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Move the particle
        this.x += this.speedX;
        this.y += this.speedY;

        // If particle goes off screen, bring it back from the other side
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace('1)', `${this.opacity})`); // Apply opacity
        ctx.fill();
      }
    }

    // Create an array of particles - responsive to screen size
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000)); 
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Create connections between particles
    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 170; // Connection distance

          if (distance < maxDistance) {
            // Get the base color from the first particle for consistency in lines
            const baseColor = particles[i].color;
            // Create gradient opacity based on distance
            const opacity = 0.15 * (1 - distance / maxDistance);
            
            ctx.beginPath();
            ctx.strokeStyle = baseColor.replace('1)', `${opacity})`);
            ctx.lineWidth = 0.8; // Slightly thicker lines
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      // Clear with a slight blur effect for trails
      ctx.fillStyle = 'rgba(20, 20, 30, 0.05)'; // Dark background with trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      connectParticles();
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{
        background: 'linear-gradient(135deg, rgba(20,20,35,0.95) 0%, rgba(30,30,45,0.95) 100%)', // Dark gradient background
      }}
    />
  );
};

export default AnimatedBackground;
