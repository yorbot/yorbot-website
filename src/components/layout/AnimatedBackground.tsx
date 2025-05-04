
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

    // Create particles for circuit-like connections (robotics theme)
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
      isNode: boolean;

      constructor(isNode = false) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.isNode = isNode;
        
        if (isNode) {
          // Nodes are larger connection points
          this.size = Math.random() * 4 + 3; // Size between 3 and 7
          this.speedX = (Math.random() - 0.5) * 0.1; // Very slow movement for nodes
          this.speedY = (Math.random() - 0.5) * 0.1;
          this.opacity = 0.7 + Math.random() * 0.3; // Higher opacity for nodes
        } else {
          // Regular particles
          this.size = Math.random() * 2 + 0.5; // Size between 0.5 and 2.5
          this.speedX = (Math.random() - 0.5) * 0.3; // Regular speed for particles
          this.speedY = (Math.random() - 0.5) * 0.3;
          this.opacity = 0.2 + Math.random() * 0.3; // Lower opacity for regular particles
        }
        
        // Color palette - robotics theme (blues, cyans, and accent orange)
        const colors = [
          'rgba(0, 149, 217, 1)', // Blue
          'rgba(0, 183, 235, 1)', // Cyan
          'rgba(94, 140, 222, 1)', // Light blue
          'rgba(255, 137, 51, 1)', // Orange accent (for circuit nodes)
          'rgba(180, 180, 210, 1)', // Light gray/blue
        ];
        
        // Nodes have a higher chance of being orange (circuit node effect)
        if (isNode && Math.random() > 0.5) {
          this.color = colors[3]; // Orange for some nodes
        } else {
          this.color = colors[Math.floor(Math.random() * colors.length)];
        }
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
        
        // Draw circuit node/particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace('1)', `${this.opacity})`);
        ctx.fill();
        
        // For nodes, add a subtle glow effect
        if (this.isNode) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = this.color.replace('1)', '0.05)');
          ctx.fill();
        }
      }
    }

    // Create an array of particles - responsive to screen size
    const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000));
    const nodeCount = Math.floor(particleCount / 5); // About 20% of particles are nodes
    const particles: Particle[] = [];

    // Create nodes first (larger connection points)
    for (let i = 0; i < nodeCount; i++) {
      particles.push(new Particle(true));
    }
    
    // Then regular particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(false));
    }

    // Create connections between particles (circuit-like connections)
    const connectParticles = () => {
      // First, connect all nodes to their closest node (circuit backbone)
      for (let i = 0; i < nodeCount; i++) {
        let closestNodeIndex = -1;
        let minDistance = Infinity;
        
        for (let j = 0; j < nodeCount; j++) {
          if (i !== j) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance && distance < canvas.width / 3) {
              minDistance = distance;
              closestNodeIndex = j;
            }
          }
        }
        
        // Draw connection to closest node
        if (closestNodeIndex !== -1) {
          const opacity = 0.15 * (1 - minDistance / (canvas.width / 3));
          ctx.beginPath();
          ctx.strokeStyle = particles[i].color.replace('1)', `${opacity})`);
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[closestNodeIndex].x, particles[closestNodeIndex].y);
          ctx.stroke();
        }
      }
      
      // Then, connect regular particles to nearby nodes or particles
      for (let i = nodeCount; i < particles.length; i++) {
        for (let j = 0; j < particles.length; j++) {
          if (i !== j) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = particles[j].isNode ? 150 : 100; // Longer connections to nodes
            
            if (distance < maxDistance) {
              // Draw connections with gradient opacity based on distance
              const opacity = particles[j].isNode ? 
                0.2 * (1 - distance / maxDistance) : 
                0.1 * (1 - distance / maxDistance);
              
              ctx.beginPath();
              ctx.strokeStyle = particles[j].color.replace('1)', `${opacity})`);
              ctx.lineWidth = particles[j].isNode ? 0.8 : 0.5; // Thicker lines to nodes
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      // Clear with a slight blur effect for trails
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'; // White background with trail effect
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
        background: 'linear-gradient(135deg, rgba(250,250,255,0.97) 0%, rgba(245,245,250,0.97) 100%)', // Light gradient background
      }}
    />
  );
};

export default AnimatedBackground;
