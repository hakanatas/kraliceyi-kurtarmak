// High-performance canvas particle background and explosion engine for "Kraliçeyi Kurtarmak"

let canvas = null;
let ctx = null;
let particles = [];
let explosions = [];
let confetti = [];
let mouse = { x: null, y: null, radius: 120 };
let animationId = null;
let isPaused = false;

// Particle Class for the Ambient Background
class AmbientParticle {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.w;
    this.y = Math.random() * this.h;
    this.size = Math.random() * 3 + 1; // Slightly larger for visibility
    this.speedX = Math.random() * 0.4 - 0.2;
    this.speedY = Math.random() * 0.4 - 0.2;
    // Glow cycle
    this.alpha = Math.random() * 0.6 + 0.2;
    this.alphaSpeed = Math.random() * 0.01 + 0.002;
    this.growing = Math.random() > 0.5;
    
    // Indigo, Emerald green or Gold sparkles
    const randomVal = Math.random();
    if (randomVal > 0.6) {
      this.color = 'rgba(99, 102, 241, 0.65)'; // Indigo
    } else if (randomVal > 0.3) {
      this.color = 'rgba(16, 185, 129, 0.65)'; // Emerald
    } else {
      this.color = 'rgba(217, 119, 6, 0.65)'; // Gold
    }
  }

  update() {
    // Basic motion
    this.x += this.speedX;
    this.y += this.speedY;

    // Boundary wrapping
    if (this.x < 0) this.x = this.w;
    if (this.x > this.w) this.x = 0;
    if (this.y < 0) this.y = this.h;
    if (this.y > this.h) this.y = 0;

    // Pulsating alpha
    if (this.growing) {
      this.alpha += this.alphaSpeed;
      if (this.alpha >= 0.8) this.growing = false;
    } else {
      this.alpha -= this.alphaSpeed;
      if (this.alpha <= 0.2) this.growing = true;
    }

    // Mouse Interaction (Push/Pull effect like Frontier Within)
    if (mouse.x !== null && mouse.y !== null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouse.radius) {
        // Slow push away
        let force = (mouse.radius - distance) / mouse.radius;
        let angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 1.5;
        this.y -= Math.sin(angle) * force * 1.5;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    // Parse color string to inject dynamic alpha
    const cleanColor = this.color.substring(0, this.color.lastIndexOf(','));
    ctx.fillStyle = `${cleanColor}, ${this.alpha})`;
    ctx.fill();
  }
}

// Particle Class for Success Explosions
class BurstParticle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 2; // Slightly larger for wow effect
    
    // Spread speed
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    
    // Physics
    this.gravity = 0.08;
    this.drag = 0.96;
    
    // Lifespan
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.01;
    this.hue = hue || (Math.random() > 0.5 ? 160 : 45); // 160 is Emerald Green, 45 is Golden Yellow
  }

  update() {
    this.vx *= this.drag;
    this.vy *= this.drag;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 85%, 50%, ${this.alpha})`; // Saturated for light theme
    
    // Shadow glow
    ctx.shadowBlur = 8;
    ctx.shadowColor = `hsla(${this.hue}, 85%, 50%, ${this.alpha})`;
    
    ctx.fill();
    ctx.restore();
  }
}

// Confetti Particle Class for correct answers and final success celebration
class ConfettiParticle {
  constructor(x, y, angle, speed) {
    this.x = x;
    this.y = y;
    this.sizeWidth = Math.random() * 8 + 6;
    this.sizeHeight = Math.random() * 12 + 8;
    
    // Convert angle to radians and add variance
    const rad = angle + (Math.random() * 0.4 - 0.2);
    const finalSpeed = speed * (Math.random() * 0.5 + 0.75);
    this.vx = Math.cos(rad) * finalSpeed;
    this.vy = Math.sin(rad) * finalSpeed;
    
    // Physics
    this.gravity = 0.16;
    this.drag = 0.98;
    this.wind = (Math.random() * 0.3 - 0.15);
    
    // Lifespan & fade
    this.alpha = 1;
    this.decay = Math.random() * 0.01 + 0.006;
    
    // Palette of vibrant colors
    const colors = [
      '#f43f5e', // rose
      '#3b82f6', // blue
      '#10b981', // emerald
      '#eab308', // yellow
      '#a855f7', // purple
      '#ff7849', // orange
      '#ec4899'  // pink
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    
    // Rotation
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() * 10 - 5);
  }

  update() {
    this.vx *= this.drag;
    this.vy *= this.drag;
    this.vy += this.gravity;
    this.x += this.vx + this.wind;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.alpha -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fillRect(-this.sizeWidth / 2, -this.sizeHeight / 2, this.sizeWidth, this.sizeHeight);
    ctx.restore();
  }
}

// Initialize the Canvas background
export function initCanvas(canvasId) {
  canvas = document.getElementById(canvasId);
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  
  // Set dimensions
  resizeCanvas();
  
  // Create ambient particles
  particles = [];
  const particleCount = Math.floor((canvas.width * canvas.height) / 8000);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new AmbientParticle(canvas.width, canvas.height));
  }

  // Setup Event Listeners
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);

  // Start Animation Loop
  animate();
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Re-adjust ambient particle count if resize is significant
  if (particles.length > 0) {
    const desiredCount = Math.floor((canvas.width * canvas.height) / 8000);
    if (particles.length < desiredCount) {
      for (let i = particles.length; i < desiredCount; i++) {
        particles.push(new AmbientParticle(canvas.width, canvas.height));
      }
    } else if (particles.length > desiredCount) {
      particles.splice(desiredCount);
    }
    // Update widths/heights inside particles
    particles.forEach(p => {
      p.w = canvas.width;
      p.h = canvas.height;
    });
  }
}

function handleMouseMove(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

function handleMouseLeave() {
  mouse.x = null;
  mouse.y = null;
}

// Main Animation Loop
function animate() {
  if (!canvas || !ctx || isPaused) return;

  // Clear canvas transparently so the CSS gradient background shines through
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ambient particles
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // Draw/update explosions
  for (let i = explosions.length - 1; i >= 0; i--) {
    const ep = explosions[i];
    ep.update();
    ep.draw();
    if (ep.alpha <= 0) {
      explosions.splice(i, 1);
    }
  }

  // Draw/update confetti
  for (let i = confetti.length - 1; i >= 0; i--) {
    const c = confetti[i];
    c.update();
    c.draw();
    if (c.alpha <= 0) {
      confetti.splice(i, 1);
    }
  }

  animationId = requestAnimationFrame(animate);
}

// Trigger an explosion of particles at a specific viewport coordinate
export function triggerExplosion(x, y, count = 60, hue = null) {
  if (!canvas) return;
  
  // Fallback to center if coords are invalid
  const spawnX = x !== undefined ? x : canvas.width / 2;
  const spawnY = y !== undefined ? y : canvas.height / 2;
  
  // If hue is null, randomly alternate between Emerald Green (150-165) and Gold (40-50)
  for (let i = 0; i < count; i++) {
    const particleHue = hue !== null ? hue : (Math.random() > 0.5 ? Math.floor(Math.random() * 15) + 150 : Math.floor(Math.random() * 10) + 40);
    explosions.push(new BurstParticle(spawnX, spawnY, particleHue));
  }
}

// Trigger Confetti cannon from bottom corners
export function triggerConfetti() {
  if (!canvas) return;
  
  // Left cannon (shooting up-right, angle around -45 deg)
  for (let i = 0; i < 75; i++) {
    confetti.push(new ConfettiParticle(0, canvas.height, -Math.PI / 4, Math.random() * 12 + 10));
  }
  
  // Right cannon (shooting up-left, angle around -135 deg)
  for (let i = 0; i < 75; i++) {
    confetti.push(new ConfettiParticle(canvas.width, canvas.height, -3 * Math.PI / 4, Math.random() * 12 + 10));
  }
}

// Cleanup listeners on destroy (useful for hot reload/SPA navigation)
export function destroyCanvas() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  window.removeEventListener('resize', resizeCanvas);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseleave', handleMouseLeave);
  canvas = null;
  ctx = null;
}

// Toggle pause/resume canvas animations
export function togglePauseCanvas(shouldPause) {
  if (isPaused === shouldPause) return;
  isPaused = shouldPause;
  if (!isPaused) {
    animate();
  } else {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}
