import React, { useEffect, useRef } from 'react';
import jakeBgImage from '../../assets/images/jake_moon_hills_wallpaper_1786562280702.jpg';

interface RainyHighwayCanvasProps {
  wallpaperMode: 'jake-night' | 'porsche-rain' | 'cyber-rain' | 'cupertino-nebula' | 'abstract-glass' | 'dark-studio';
  graphicQuality: 'high' | 'medium' | 'low';
  rainDensity: number;
}

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  alpha: number;
  pulse: number;
}

interface MusicNote {
  x: number;
  y: number;
  startY: number;
  symbol: string;
  size: number;
  speedY: number;
  swayAmplitude: number;
  swaySpeed: number;
  opacity: number;
  color: string;
  rotation: number;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  dx: number;
  dy: number;
}

interface Firefly {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  pulse: number;
  pulseSpeed: number;
  color: string;
}

export const RainyHighwayCanvas: React.FC<RainyHighwayCanvasProps> = ({
  wallpaperMode,
  graphicQuality,
  rainDensity
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const jakeImgRef = useRef<HTMLImageElement | null>(null);

  // Preload Jake background image
  useEffect(() => {
    const img = new Image();
    img.src = jakeBgImage;
    if (img.complete) {
      jakeImgRef.current = img;
    } else {
      img.onload = () => {
        jakeImgRef.current = img;
      };
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseRef.current.targetX = (e.clientX - centerX) / centerX;
      mouseRef.current.targetY = (e.clientY - centerY) / centerY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const getVW = () => window.visualViewport?.width ?? window.innerWidth;
    const getVH = () => window.visualViewport?.height ?? window.innerHeight;
    let width = (canvas.width = getVW());
    let height = (canvas.height = getVH());

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = getVW();
      height = canvas.height = getVH();
    };

    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);

    // Initialize Rain Drops
    const dropCount = graphicQuality === 'low' ? 60 : graphicQuality === 'medium' ? 140 : 250 * (rainDensity / 3);
    const rainDrops: RainDrop[] = [];
    for (let i = 0; i < dropCount; i++) {
      rainDrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 25 + 15,
        speed: Math.random() * 15 + 12,
        opacity: Math.random() * 0.4 + 0.2
      });
    }

    // Initialize Floating Particles
    const particleCount = graphicQuality === 'low' ? 25 : 60;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 0.5,
        speedY: -(Math.random() * 0.5 + 0.2),
        speedX: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.7 + 0.2,
        pulse: Math.random() * Math.PI * 2
      });
    }

    // Jake Night Specific Live Effects
    const musicNotes: MusicNote[] = [];
    const noteSymbols = ['🎵', '🎶', '🎼', '🎧', '✨'];
    const noteColors = ['#38bdf8', '#a855f7', '#facc15', '#34d399', '#f472b6'];

    const meteors: Meteor[] = [];
    let lastMeteorTime = 0;

    const fireflies: Firefly[] = [];
    const fireflyCount = graphicQuality === 'low' ? 12 : graphicQuality === 'medium' ? 25 : 45;
    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: height * 0.5 + Math.random() * (height * 0.48),
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: (Math.random() - 0.5) * 0.4,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        color: Math.random() > 0.5 ? 'rgba(250, 204, 21, ' : 'rgba(52, 211, 153, '
      });
    }

    // Render loop
    const startTime = Date.now();
    let lastNoteTime = 0;

    const render = () => {
      const now = Date.now();
      const time = (now - startTime) * 0.001;

      // Lerp mouse camera offset
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const camX = mouseRef.current.x * 25;
      const camY = mouseRef.current.y * 15;

      ctx.clearRect(0, 0, width, height);

      if (wallpaperMode === 'jake-night') {
        drawJakeNightScene(
          ctx,
          width,
          height,
          camX,
          camY,
          time,
          jakeImgRef.current,
          musicNotes,
          meteors,
          fireflies
        );

        // Spawn Meteors periodically
        if (now - lastMeteorTime > Math.random() * 3000 + 3500) {
          lastMeteorTime = now;
          meteors.push({
            x: Math.random() * (width * 0.6) + width * 0.3,
            y: Math.random() * (height * 0.25) + 20,
            length: Math.random() * 80 + 60,
            speed: Math.random() * 12 + 10,
            opacity: 1,
            dx: -(Math.random() * 6 + 8),
            dy: Math.random() * 4 + 6
          });
        }

      } else if (wallpaperMode === 'porsche-rain' || wallpaperMode === 'cyber-rain') {
        drawPorscheHighwayScene(ctx, width, height, camX, camY, wallpaperMode, time);
      } else if (wallpaperMode === 'cupertino-nebula') {
        drawCupertinoNebulaScene(ctx, width, height, camX, camY);
      } else if (wallpaperMode === 'abstract-glass') {
        drawAbstractGlassScene(ctx, width, height, camX, camY);
      } else {
        drawDarkStudioScene(ctx, width, height, camX, camY);
      }

      // Draw Rain if in rain modes
      if (wallpaperMode === 'porsche-rain' || wallpaperMode === 'cyber-rain') {
        ctx.strokeStyle = wallpaperMode === 'cyber-rain' ? 'rgba(56, 189, 248, 0.5)' : 'rgba(186, 230, 253, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let i = 0; i < rainDrops.length; i++) {
          const drop = rainDrops[i];
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x + camX * 0.1, drop.y + drop.length);

          drop.y += drop.speed;
          drop.x += camX * 0.05;

          if (drop.y > height) {
            drop.y = -drop.length;
            drop.x = Math.random() * width;
          }
        }
        ctx.stroke();
      }

      // Draw Floating Particles for non-Jake modes
      if (wallpaperMode !== 'jake-night') {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.pulse += 0.03;
          const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

          ctx.fillStyle = wallpaperMode === 'cyber-rain'
            ? `rgba(168, 85, 247, ${currentAlpha})`
            : `rgba(96, 165, 250, ${currentAlpha})`;

          ctx.beginPath();
          ctx.arc(p.x + camX * 0.3, p.y + camY * 0.3, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.y += p.speedY;
          p.x += p.speedX;

          if (p.y < 0) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [wallpaperMode, graphicQuality, rainDensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{
        transform: 'translateZ(0)',
        willChange: 'transform'
      }}
    />
  );
};

// --- Scene Rendering Helpers ---

function drawPorscheHighwayScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  camX: number,
  camY: number,
  mode: 'porsche-rain' | 'cyber-rain',
  time: number
) {
  const isCyber = mode === 'cyber-rain';

  // 1. Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
  if (isCyber) {
    skyGrad.addColorStop(0, '#05030e');
    skyGrad.addColorStop(0.5, '#0b0826');
    skyGrad.addColorStop(1, '#1b0c3f');
  } else {
    skyGrad.addColorStop(0, '#020617');
    skyGrad.addColorStop(0.5, '#081329');
    skyGrad.addColorStop(1, '#0f2347');
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. City Skyline Silhouettes
  const horizonY = h * 0.58 + camY * 0.2;
  const buildingColors = isCyber
    ? ['#090518', '#120b2e', '#1e1147']
    : ['#040a17', '#08152e', '#0d2145'];

  for (let b = 0; b < 22; b++) {
    const bw = 40 + (b * 37) % 80;
    const bh = 100 + (b * 53) % 180;
    const bx = (b * (w / 20)) - 50 + camX * 0.15;
    const by = horizonY - bh;

    ctx.fillStyle = buildingColors[b % buildingColors.length];
    ctx.fillRect(bx, by, bw, bh + 50);

    // Glowing windows
    ctx.fillStyle = isCyber ? 'rgba(168, 85, 247, 0.4)' : 'rgba(56, 189, 248, 0.35)';
    for (let wy = by + 10; wy < horizonY - 10; wy += 18) {
      for (let wx = bx + 6; wx < bx + bw - 8; wx += 12) {
        if ((wx + wy + b) % 3 === 0) {
          ctx.fillRect(wx, wy, 4, 6);
        }
      }
    }
  }

  // 2.5. Elevated Futuristic Dark Train / Monorail (Trem Preto Futurista)
  drawElevatedFuturisticTrain(ctx, w, horizonY - 35, camX, time, isCyber);

  // City horizon fog / neon glow
  const fogGrad = ctx.createLinearGradient(0, horizonY - 120, 0, horizonY + 20);
  fogGrad.addColorStop(0, 'rgba(0,0,0,0)');
  fogGrad.addColorStop(0.6, isCyber ? 'rgba(168, 85, 247, 0.25)' : 'rgba(14, 165, 233, 0.22)');
  fogGrad.addColorStop(1, 'rgba(2, 6, 23, 0.9)');
  ctx.fillStyle = fogGrad;
  ctx.fillRect(0, horizonY - 120, w, 160);

  // 3. Wet Asphalt Road
  const roadGrad = ctx.createLinearGradient(0, horizonY, 0, h);
  roadGrad.addColorStop(0, '#080d1a');
  roadGrad.addColorStop(0.4, '#040711');
  roadGrad.addColorStop(1, '#010308');
  ctx.fillStyle = roadGrad;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  // Perspective Road markings and wet reflections
  const vpX = w * 0.5 + camX * 0.4;
  const vpY = horizonY;

  ctx.strokeStyle = isCyber ? 'rgba(236, 72, 153, 0.4)' : 'rgba(56, 189, 248, 0.35)';
  ctx.lineWidth = 2;

  // Road Side Lines
  ctx.beginPath();
  ctx.moveTo(vpX - 80, vpY);
  ctx.lineTo(-w * 0.3, h);
  ctx.moveTo(vpX + 80, vpY);
  ctx.lineTo(w * 1.3, h);
  ctx.stroke();

  // Wet Reflection Rays on Asphalt
  const refGrad = ctx.createRadialGradient(
    vpX, h * 0.78, 20,
    vpX, h * 0.78, w * 0.6
  );
  refGrad.addColorStop(0, isCyber ? 'rgba(168, 85, 247, 0.28)' : 'rgba(56, 189, 248, 0.25)');
  refGrad.addColorStop(0.5, isCyber ? 'rgba(236, 72, 153, 0.12)' : 'rgba(14, 165, 233, 0.1)');
  refGrad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = refGrad;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  // 4. Porsche Supercar Silhouette (Parked on Road Perspective)
  drawPorscheSupercar(ctx, w * 0.5 + camX * 0.3, h * 0.74 + camY * 0.1, isCyber);
}

function drawPorscheSupercar(ctx: CanvasRenderingContext2D, cx: number, cy: number, isCyber: boolean) {
  ctx.save();
  ctx.translate(cx, cy);

  const scale = 1.1;
  ctx.scale(scale, scale);

  // Supercar Shadow & Ground Wet Glow
  const groundGlow = ctx.createRadialGradient(0, 35, 10, 0, 35, 180);
  groundGlow.addColorStop(0, isCyber ? 'rgba(236, 72, 153, 0.6)' : 'rgba(56, 189, 248, 0.5)');
  groundGlow.addColorStop(0.4, isCyber ? 'rgba(168, 85, 247, 0.3)' : 'rgba(14, 165, 233, 0.2)');
  groundGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = groundGlow;
  ctx.fillRect(-220, 10, 440, 60);

  // Body Outline (Rear-Three-Quarter Porsche 911 / Taycan Silhouette)
  ctx.beginPath();
  // Roof arch
  ctx.moveTo(-70, -45);
  ctx.bezierCurveTo(-30, -58, 20, -55, 60, -32);
  // Rear slope
  ctx.bezierCurveTo(110, -15, 140, 0, 155, 12);
  // Rear bumper
  ctx.bezierCurveTo(160, 22, 155, 32, 140, 34);
  // Underbody
  ctx.lineTo(-140, 34);
  // Front nose
  ctx.bezierCurveTo(-155, 30, -160, 15, -145, -5);
  // Hood and windshield
  ctx.bezierCurveTo(-125, -25, -95, -40, -70, -45);
  ctx.closePath();

  // Body Metallic Paint Gradient
  const bodyGrad = ctx.createLinearGradient(-150, -50, 150, 40);
  if (isCyber) {
    bodyGrad.addColorStop(0, '#0f051d');
    bodyGrad.addColorStop(0.4, '#1e0a38');
    bodyGrad.addColorStop(0.7, '#3b0764');
    bodyGrad.addColorStop(1, '#0b0214');
  } else {
    bodyGrad.addColorStop(0, '#02132b');
    bodyGrad.addColorStop(0.4, '#032854');
    bodyGrad.addColorStop(0.7, '#0284c7');
    bodyGrad.addColorStop(1, '#020b18');
  }
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Glass Cabin & Reflection
  ctx.beginPath();
  ctx.moveTo(-55, -42);
  ctx.bezierCurveTo(-25, -52, 15, -48, 52, -28);
  ctx.lineTo(10, -26);
  ctx.lineTo(-45, -26);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.fill();

  // Porsche Iconic LED Lightbar (Rear Light Bar)
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 20;
  ctx.strokeStyle = '#f87171';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(85, 12);
  ctx.lineTo(152, 14);
  ctx.stroke();

  // Front Headlight Beam Reflection
  ctx.shadowColor = isCyber ? '#ec4899' : '#38bdf8';
  ctx.shadowBlur = 25;
  ctx.fillStyle = isCyber ? 'rgba(236, 72, 153, 0.8)' : 'rgba(56, 189, 248, 0.85)';
  ctx.beginPath();
  ctx.ellipse(-148, 10, 8, 4, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Headlight Projection Light Cone
  const coneGrad = ctx.createLinearGradient(-150, 10, -350, 25);
  coneGrad.addColorStop(0, isCyber ? 'rgba(236, 72, 153, 0.4)' : 'rgba(56, 189, 248, 0.45)');
  coneGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = coneGrad;
  ctx.beginPath();
  ctx.moveTo(-150, 8);
  ctx.lineTo(-380, -40);
  ctx.lineTo(-380, 80);
  ctx.closePath();
  ctx.fill();

  // Wheels
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#090d16';
  ctx.beginPath();
  ctx.arc(-95, 30, 22, 0, Math.PI * 2);
  ctx.arc(85, 30, 24, 0, Math.PI * 2);
  ctx.fill();

  // Alloy Rims Glow
  ctx.strokeStyle = isCyber ? '#c084fc' : '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-95, 30, 14, 0, Math.PI * 2);
  ctx.arc(85, 30, 15, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawCupertinoNebulaScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  camX: number,
  camY: number
) {
  const bgGrad = ctx.createRadialGradient(
    w * 0.5 + camX, h * 0.5 + camY, 50,
    w * 0.5, h * 0.5, w * 0.8
  );
  bgGrad.addColorStop(0, '#1e1b4b');
  bgGrad.addColorStop(0.4, '#0f172a');
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Fluid Glowing Circles
  const time = Date.now() * 0.001;

  ctx.fillStyle = 'rgba(99, 102, 241, 0.25)';
  ctx.beginPath();
  ctx.arc(w * 0.3 + camX * 1.5 + Math.sin(time) * 40, h * 0.4 + camY * 1.5, 280, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(168, 85, 247, 0.22)';
  ctx.beginPath();
  ctx.arc(w * 0.7 + camX * 1.2, h * 0.6 + camY * 1.2 + Math.cos(time * 0.8) * 50, 320, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(14, 165, 233, 0.2)';
  ctx.beginPath();
  ctx.arc(w * 0.5 + Math.cos(time * 0.5) * 60, h * 0.7, 240, 0, Math.PI * 2);
  ctx.fill();
}

function drawAbstractGlassScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  camX: number,
  camY: number
) {
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, w, h);

  // Geometric glass polygons
  ctx.save();
  ctx.translate(camX * 0.8, camY * 0.8);

  ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(w * 0.2, h * 0.1);
  ctx.lineTo(w * 0.6, h * 0.3);
  ctx.lineTo(w * 0.4, h * 0.8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  ctx.beginPath();
  ctx.moveTo(w * 0.5, h * 0.2);
  ctx.lineTo(w * 0.85, h * 0.5);
  ctx.lineTo(w * 0.65, h * 0.9);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawDarkStudioScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  camX: number,
  camY: number
) {
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, w, h);

  // Subtle grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  const gridSize = 60;

  ctx.beginPath();
  for (let x = camX % gridSize; x < w; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (let y = camY % gridSize; y < h; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();

  // Subtle Center Spotlight
  const spotGrad = ctx.createRadialGradient(
    w * 0.5 + camX, h * 0.4 + camY, 20,
    w * 0.5, h * 0.5, w * 0.5
  );
  spotGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
  spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = spotGrad;
  ctx.fillRect(0, 0, w, h);
}

// --- Elevated Futuristic Dark Train (Trem Preto Futurista em Movimento) ---
function drawElevatedFuturisticTrain(
  ctx: CanvasRenderingContext2D,
  w: number,
  trackY: number,
  camX: number,
  time: number,
  isCyber: boolean
) {
  ctx.save();

  // 1. Elevated Bridge Rail Beam
  const railY = trackY + 8;
  ctx.fillStyle = '#070b14';
  ctx.fillRect(0, railY, w, 5);

  // Rail Neon Guide Line
  ctx.strokeStyle = isCyber ? 'rgba(168, 85, 247, 0.5)' : 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, railY);
  ctx.lineTo(w, railY);
  ctx.stroke();

  // Bridge Support Pillars
  ctx.fillStyle = '#050810';
  const pillarSpacing = 160;
  for (let px = (camX * 0.1) % pillarSpacing; px < w; px += pillarSpacing) {
    ctx.fillRect(px, railY + 5, 8, 45);
    ctx.fillStyle = isCyber ? 'rgba(236, 72, 153, 0.3)' : 'rgba(56, 189, 248, 0.25)';
    ctx.fillRect(px + 2, railY + 12, 4, 4);
    ctx.fillStyle = '#050810';
  }

  // 2. Futuristic Dark Bullet Train Position (Trem Preto)
  const trainLength = 340;
  const speed = 75; // px per second
  const totalTravel = w + trainLength + 200;
  const currentX = ((time * speed + 100) % totalTravel) - trainLength + camX * 0.2;
  const trainY = railY - 14;

  // Magnetic Levitation Undercarriage Glow
  const magGlow = ctx.createRadialGradient(
    currentX + trainLength / 2, trainY + 14, 10,
    currentX + trainLength / 2, trainY + 14, trainLength / 2
  );
  magGlow.addColorStop(0, isCyber ? 'rgba(168, 85, 247, 0.45)' : 'rgba(56, 189, 248, 0.4)');
  magGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = magGlow;
  ctx.fillRect(currentX - 20, trainY + 6, trainLength + 40, 16);

  // Train Body: Carriages (Locomotive + Passenger Cars)
  const cars = [
    { type: 'tail', width: 70 },
    { type: 'mid', width: 85 },
    { type: 'mid', width: 85 },
    { type: 'front', width: 90 }
  ];

  let carX = currentX;

  for (let i = 0; i < cars.length; i++) {
    const car = cars[i];
    const cw = car.width;
    const ch = 13;

    // Dark Carbon Body
    ctx.fillStyle = '#0a0d16';
    ctx.strokeStyle = isCyber ? 'rgba(168, 85, 247, 0.4)' : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;

    if (car.type === 'front') {
      // Aerodynamic Bullet Nose Front Car
      ctx.beginPath();
      ctx.moveTo(carX, trainY);
      ctx.lineTo(carX + cw - 25, trainY);
      ctx.bezierCurveTo(carX + cw - 5, trainY + 2, carX + cw, trainY + 8, carX + cw, trainY + ch);
      ctx.lineTo(carX, trainY + ch);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cockpit Windshield Glow
      ctx.fillStyle = isCyber ? 'rgba(236, 72, 153, 0.85)' : 'rgba(56, 189, 248, 0.9)';
      ctx.beginPath();
      ctx.moveTo(carX + cw - 22, trainY + 3);
      ctx.lineTo(carX + cw - 8, trainY + 5);
      ctx.lineTo(carX + cw - 12, trainY + 8);
      ctx.lineTo(carX + cw - 24, trainY + 8);
      ctx.closePath();
      ctx.fill();

      // Front Headlight Beam Projection in the Rain
      const beamGrad = ctx.createLinearGradient(carX + cw, trainY + 8, carX + cw + 180, trainY + 8);
      beamGrad.addColorStop(0, isCyber ? 'rgba(236, 72, 153, 0.6)' : 'rgba(56, 189, 248, 0.65)');
      beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(carX + cw, trainY + 6);
      ctx.lineTo(carX + cw + 180, trainY - 10);
      ctx.lineTo(carX + cw + 180, trainY + 25);
      ctx.closePath();
      ctx.fill();
    } else if (car.type === 'tail') {
      // Rear Car with Red LED Light
      ctx.beginPath();
      ctx.roundRect(carX, trainY, cw, ch, [4, 0, 0, 4]);
      ctx.fill();
      ctx.stroke();

      // Rear Red Tail Lights
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(carX + 2, trainY + 4, 3, 5);
    } else {
      // Middle Passenger Car
      ctx.beginPath();
      ctx.rect(carX, trainY, cw, ch);
      ctx.fill();
      ctx.stroke();
    }

    // Glowing Panoramic Interior Window Stripes
    ctx.fillStyle = isCyber ? 'rgba(168, 85, 247, 0.75)' : 'rgba(56, 189, 248, 0.7)';
    const windowStart = car.type === 'tail' ? carX + 12 : carX + 6;
    const windowEnd = car.type === 'front' ? carX + cw - 30 : carX + cw - 6;

    for (let wx = windowStart; wx < windowEnd; wx += 14) {
      ctx.fillRect(wx, trainY + 4, 8, 4);
    }

    carX += cw + 3; // Gap between cars
  }

  ctx.restore();
}

// --- Jake Night (Adventure Time Lo-Fi Night) Scene ---
function drawJakeNightScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  camX: number,
  camY: number,
  time: number,
  bgImg: HTMLImageElement | null,
  musicNotes: MusicNote[],
  meteors: Meteor[],
  fireflies: Firefly[]
) {
  // 1. Draw Jake Background Image (Responsive: full image on tablet/mobile, cover on desktop)
  if (bgImg && bgImg.complete) {
    const imgRatio = bgImg.width / bgImg.height;
    const canvasRatio = w / h;
    let renderW = w;
    let renderH = h;
    let offsetX = 0;
    let offsetY = 0;

    if (w < 1024) {
      // Tablet & Mobile: CONTAIN — show the entire image without cropping
      if (imgRatio > canvasRatio) {
        // Image is wider than canvas ratio → fit by width, bars top/bottom
        renderW = w;
        renderH = w / imgRatio;
        offsetX = 0;
        offsetY = (h - renderH) / 2;
      } else {
        // Image is taller than canvas ratio → fit by height, bars left/right
        renderH = h;
        renderW = h * imgRatio;
        offsetX = (w - renderW) / 2;
        offsetY = 0;
      }
    } else if (canvasRatio > imgRatio) {
      renderH = w / imgRatio;
      offsetY = (h - renderH) / 2;
    } else {
      renderW = h * imgRatio;
      offsetX = (w - renderW) / 2;
    }

    // Fill any letterbox bars with the night gradient so it blends nicely
    if (w < 1024) {
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#040b1e');
      bgGrad.addColorStop(0.5, '#0b203c');
      bgGrad.addColorStop(1, '#063025');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.save();
    // Parallax slight offset (kept subtle; no mouse on tablet/mobile so camX/Y stay ~0)
    const parallaxX = camX * 0.15;
    const parallaxY = camY * 0.15;
    ctx.drawImage(bgImg, offsetX + parallaxX - 10, offsetY + parallaxY - 10, renderW + 20, renderH + 20);
    ctx.restore();
  } else {
    // Fallback night gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#040b1e');
    bgGrad.addColorStop(0.5, '#0b203c');
    bgGrad.addColorStop(1, '#063025');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);
  }

  // 2. Luminous Moon Pulse (Glow around the bright cyan moon)
  const moonX = w * 0.32 + camX * 0.1;
  const moonY = h * 0.19 + camY * 0.1;
  const moonPulse = 1 + Math.sin(time * 2) * 0.08;

  ctx.save();
  const moonGlow = ctx.createRadialGradient(
    moonX, moonY, 10,
    moonX, moonY, 160 * moonPulse
  );
  moonGlow.addColorStop(0, 'rgba(103, 232, 249, 0.45)');
  moonGlow.addColorStop(0.3, 'rgba(56, 189, 248, 0.22)');
  moonGlow.addColorStop(0.7, 'rgba(14, 116, 144, 0.08)');
  moonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = moonGlow;
  ctx.beginPath();
  ctx.arc(moonX, moonY, 160 * moonPulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Jake Headphones Beat Pulse
  const jakeX = w * 0.20 + camX * 0.15;
  const jakeY = h * 0.65 + camY * 0.15;
  const beatPulse = 1 + Math.sin(time * 5) * 0.15;

  ctx.save();
  const beatGlow = ctx.createRadialGradient(
    jakeX, jakeY, 4,
    jakeX, jakeY, 50 * beatPulse
  );
  beatGlow.addColorStop(0, 'rgba(250, 204, 21, 0.35)');
  beatGlow.addColorStop(0.5, 'rgba(56, 189, 248, 0.15)');
  beatGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = beatGlow;
  ctx.beginPath();
  ctx.arc(jakeX, jakeY, 50 * beatPulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Draw Shooting Meteors
  ctx.save();
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i];
    m.x += m.dx;
    m.y += m.dy;
    m.opacity -= 0.008;

    if (m.opacity <= 0 || m.x < 0 || m.y > h) {
      meteors.splice(i, 1);
      continue;
    }

    const meteorGrad = ctx.createLinearGradient(
      m.x, m.y,
      m.x - m.dx * 6, m.y - m.dy * 6
    );
    meteorGrad.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`);
    meteorGrad.addColorStop(0.3, `rgba(125, 211, 252, ${m.opacity * 0.8})`);
    meteorGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.strokeStyle = meteorGrad;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(m.x - m.dx * 6, m.y - m.dy * 6);
    ctx.stroke();

    // Meteor tip star
    ctx.fillStyle = `rgba(255, 255, 255, ${m.opacity})`;
    ctx.beginPath();
    ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 5. Draw Glowing Fireflies over grassy hills
  ctx.save();
  for (let i = 0; i < fireflies.length; i++) {
    const f = fireflies[i];
    f.pulse += f.pulseSpeed;
    f.x += f.speedX + Math.sin(time + i) * 0.2;
    f.y += f.speedY + Math.cos(time + i * 0.5) * 0.2;

    if (f.x < 0) f.x = w;
    if (f.x > w) f.x = 0;
    if (f.y < h * 0.45) f.y = h * 0.9;
    if (f.y > h) f.y = h * 0.45;

    const alpha = (0.3 + 0.7 * Math.abs(Math.sin(f.pulse))) * 0.85;

    ctx.fillStyle = `${f.color}${alpha})`;
    ctx.beginPath();
    ctx.arc(f.x + camX * 0.2, f.y + camY * 0.2, f.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
