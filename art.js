/**
 * PROJECT 456: ARCHITECTURE OF SURVIVAL
 * Official Entry for CODE ART ATTACK 2026 — Theme: SQUID GAME 🦑
 * 
 * Generative Digital Artwork Canvas System
 * - Procedural 2.5D/3D Rendering Engine
 * - Interactive Young-hee Surveillance Panopticon & Laser Grid
 * - Low-poly Faceted 3D Front Man Mask & Sacred Geometry Morphing
 * - Real-time Physics Particle Simulation (45.6 Billion Won Cascade)
 * - M.C. Escher Impossible Staircase Architecture
 * - 4K High-Resolution Screenshot Exporter
 */

class SquidGameArt {
  constructor() {
    this.canvas = document.getElementById('artCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Telemetry and HUD Elements
    this.ecgCanvas = document.getElementById('ecgCanvas');
    this.ecgCtx = this.ecgCanvas ? this.ecgCanvas.getContext('2d') : null;
    this.playerGrid = document.getElementById('playerGrid');
    this.prizeDisplay = document.getElementById('prizeDisplay');
    this.statusIndicator = document.getElementById('statusIndicator');
    this.statusText = document.getElementById('statusText');
    this.gameStatusBadge = document.getElementById('gameStatusBadge');
    this.bpmValue = document.getElementById('bpmValue');
    this.motionStatus = document.getElementById('motionStatus');
    this.crosshairHud = document.getElementById('crosshairHud');
    this.crosshairLabel = document.getElementById('crosshairLabel');
    this.glitchFlash = document.getElementById('glitchFlash');
    this.audioSpectrumBar = document.getElementById('audioSpectrumBar');
    this.toastNotification = document.getElementById('toastNotification');

    // Visual State
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    
    // Art Modes: 'all', 'doll', 'piggy', 'geometry', 'stairs'
    this.currentMode = 'all';
    this.targetMode = 'all';
    this.modeTransition = 1.0;

    // Game state: 'GREEN' or 'RED'
    this.gameState = 'GREEN';
    this.dollHeadAngle = Math.PI; // 0 = facing player, PI = facing away
    this.targetDollAngle = Math.PI;
    this.isAutoCycling = true;
    this.autoCycleTimer = 0;

    // Mouse Tracking & Parallax
    this.mouse = { x: this.width / 2, y: this.height / 2, targetX: this.width / 2, targetY: this.height / 2, speed: 0 };
    this.lastMouseMove = Date.now();
    this.isMouseMoving = false;

    // Simulation Assets
    this.coins = [];
    this.sparkles = [];
    this.bloodStains = [];
    this.ecgPoints = [];
    this.ecgIndex = 0;
    this.time = 0;
    this.frameCount = 0;

    // 3D Geometry for Front Man Mask
    this.initFrontManMesh();
    
    // Piggy Bank parameters
    this.piggyWonAmount = 45600000000;
    this.targetPrizeAmount = 45600000000;

    this.initCanvas();
    this.initPlayerGrid();
    this.initCoins(120);
    this.bindEvents();
    
    this.showToast('SYSTEM INITIALIZED: WELCOME PLAYER 456');

    // Start animation loop
    this.lastTimestamp = performance.now();
    requestAnimationFrame(this.render.bind(this));
  }

  initCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.pixelRatio;
    this.canvas.height = this.height * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.initCanvas();
    });

    window.addEventListener('mousemove', (e) => {
      const dx = e.clientX - this.mouse.x;
      const dy = e.clientY - this.mouse.y;
      this.mouse.speed = Math.sqrt(dx * dx + dy * dy);
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
      this.lastMouseMove = Date.now();

      if (this.crosshairHud) {
        this.crosshairHud.style.left = `${e.clientX}px`;
        this.crosshairHud.style.top = `${e.clientY}px`;
      }
    });

    window.addEventListener('click', (e) => {
      // Spawn golden won explosion at click
      this.spawnCoinBurst(e.clientX, e.clientY, 15);
      if (window.soundEngine) {
        window.soundEngine.playCoinChime();
      }
    });

    // Control buttons
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-mode');
        this.setMode(mode);
      });
    });

    const toggleLightBtn = document.getElementById('toggleLightBtn');
    if (toggleLightBtn) {
      toggleLightBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleLightState();
      });
    }

    const dropCoinsBtn = document.getElementById('dropCoinsBtn');
    if (dropCoinsBtn) {
      dropCoinsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.spawnCoinBurst(this.width / 2, this.height * 0.28, 45);
        this.triggerPrizeSurge();
        if (window.soundEngine) {
          for (let i = 0; i < 4; i++) {
            setTimeout(() => window.soundEngine.playCoinChime(), i * 80);
          }
        }
      });
    }

    const toggleCrtBtn = document.getElementById('toggleCrtBtn');
    if (toggleCrtBtn) {
      toggleCrtBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.body.classList.toggle('crt-enabled');
        this.showToast('DISPLAY FILTER TOGGLED');
      });
    }

    const audioToggleBtn = document.getElementById('audioToggleBtn');
    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.soundEngine) {
          const isSoundOn = window.soundEngine.toggle();
          const audioIcon = document.getElementById('audioIcon');
          const audioLabel = document.getElementById('audioLabel');
          if (isSoundOn) {
            audioToggleBtn.classList.add('active');
            audioIcon.textContent = '🔊';
            audioLabel.textContent = 'AUDIO ON';
            this.showToast('SYNTHESIZED SOUNDSCAPE ACTIVE');
          } else {
            audioToggleBtn.classList.remove('active');
            audioIcon.textContent = '🔇';
            audioLabel.textContent = 'AUDIO OFF';
            this.showToast('AUDIO MUTED');
          }
        }
      });
    }

    const exportScreenshotBtn = document.getElementById('exportScreenshotBtn');
    if (exportScreenshotBtn) {
      exportScreenshotBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.export4KArtwork();
      });
    }

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.toggleLightState();
      } else if (e.code === 'KeyR') {
        this.spawnCoinBurst(this.width / 2, this.height * 0.28, 30);
      } else if (e.code === 'KeyM') {
        if (audioToggleBtn) audioToggleBtn.click();
      } else if (e.code === 'KeyS') {
        this.export4KArtwork();
      }
    });
  }

  setMode(mode) {
    this.targetMode = mode;
    this.currentMode = mode;
    this.showToast(`VIEWPORT SWITCHED: ${mode.toUpperCase()} MODE`);
  }

  showToast(msg, isAlert = false) {
    if (!this.toastNotification) return;
    this.toastNotification.textContent = msg;
    this.toastNotification.className = `hud-toast show ${isAlert ? 'alert' : ''}`;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastNotification.classList.remove('show');
    }, 3200);
  }

  initPlayerGrid() {
    if (!this.playerGrid) return;
    this.playerGrid.innerHTML = '';
    for (let i = 1; i <= 456; i++) {
      const dot = document.createElement('div');
      dot.className = 'p-dot';
      if (i === 456) {
        dot.classList.add('alive');
        dot.title = 'Player 456: Seong Gi-hun (SURVIVOR)';
      } else {
        dot.classList.add('dead');
      }
      this.playerGrid.appendChild(dot);
    }
  }

  toggleLightState() {
    if (this.gameState === 'GREEN') {
      this.gameState = 'RED';
      this.targetDollAngle = 0; // Snap to face camera!
      if (this.gameStatusBadge) this.gameStatusBadge.classList.add('red-alert');
      if (this.statusText) this.statusText.textContent = 'RED LIGHT ⚠️';
      const lightBtnText = document.getElementById('lightBtnText');
      if (lightBtnText) lightBtnText.textContent = '🟢 RESUME GREEN LIGHT';

      if (this.glitchFlash) {
        this.glitchFlash.classList.add('flash-red');
        setTimeout(() => this.glitchFlash.classList.remove('flash-red'), 200);
      }

      if (window.soundEngine) {
        window.soundEngine.playRedLightAlarm();
        window.soundEngine.setHeartbeatBpm(135);
      }

      if (this.bpmValue) this.bpmValue.textContent = '138 BPM';
      this.showToast('RED LIGHT ACTIVATED! ELIMINATION PROTOCOL ENGAGED', true);

    } else {
      this.gameState = 'GREEN';
      this.targetDollAngle = Math.PI; // Face away towards tree
      if (this.gameStatusBadge) this.gameStatusBadge.classList.remove('red-alert');
      if (this.statusText) this.statusText.textContent = 'GREEN LIGHT';
      const lightBtnText = document.getElementById('lightBtnText');
      if (lightBtnText) lightBtnText.textContent = '🚨 TRIGGER RED LIGHT';

      if (window.soundEngine) {
        window.soundEngine.setHeartbeatBpm(72);
        window.soundEngine.playChantMelody(() => {
          // When chant finishes, if in auto mode, can turn to red light
          if (this.isAutoCycling && this.gameState === 'GREEN') {
            setTimeout(() => this.toggleLightState(), 1200);
          }
        });
      }

      if (this.bpmValue) this.bpmValue.textContent = '74 BPM';
      this.showToast('GREEN LIGHT! ALL PLAYERS ADVANCE');
    }
  }

  triggerPrizeSurge() {
    const increment = 100000000;
    this.targetPrizeAmount += increment;
    if (this.prizeDisplay) {
      this.prizeDisplay.style.transform = 'scale(1.15)';
      setTimeout(() => {
        this.prizeDisplay.style.transform = 'scale(1)';
      }, 180);
    }
  }

  // Physics Particle Engine: Golden 45.6 Billion Won Coins
  initCoins(count = 100) {
    this.coins = [];
    for (let i = 0; i < count; i++) {
      this.coins.push(this.createCoin(false));
    }
  }

  createCoin(fromPiggy = true) {
    const x = fromPiggy 
      ? this.width / 2 + (Math.random() - 0.5) * (this.width * 0.25)
      : Math.random() * this.width;
    const y = fromPiggy 
      ? this.height * 0.22 + (Math.random() - 0.5) * 30
      : Math.random() * this.height;

    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 3.5,
      vy: Math.random() * 2 + 1,
      size: Math.random() * 10 + 12,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.08,
      tilt: Math.random() * Math.PI,
      tiltSpeed: (Math.random() - 0.5) * 0.06,
      alpha: Math.random() * 0.6 + 0.4,
      isShining: Math.random() > 0.8,
      groundY: this.height * (0.85 + Math.random() * 0.1)
    };
  }

  spawnCoinBurst(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      this.coins.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: Math.random() * 12 + 10,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        tilt: Math.random() * Math.PI,
        tiltSpeed: (Math.random() - 0.5) * 0.12,
        alpha: 1.0,
        groundY: this.height * 0.9
      });
    }
  }

  updateCoins() {
    const gravity = 0.14;
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const c = this.coins[i];
      c.vy += gravity;
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.rotSpeed;
      c.tilt += c.tiltSpeed;

      // Mouse repulsion / attraction wind
      const dx = c.x - this.mouse.x;
      const dy = c.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 1) {
        const force = (120 - dist) / 120 * 0.8;
        c.vx += (dx / dist) * force;
        c.vy += (dy / dist) * force;
      }

      // Bounce on floor
      if (c.y >= c.groundY) {
        c.y = c.groundY;
        c.vy = -c.vy * 0.45;
        c.vx *= 0.8;
        c.rotSpeed *= 0.7;
      }

      // Recycle if fallen below screen or faded
      if (c.y > this.height + 40 || c.x < -40 || c.x > this.width + 40) {
        if (this.coins.length > 150) {
          this.coins.splice(i, 1);
        } else {
          this.coins[i] = this.createCoin(true);
        }
      }
    }
  }

  drawCoin(ctx, c) {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rotation);
    ctx.scale(1, Math.cos(c.tilt));

    const radius = c.size;

    // Glowing rim
    ctx.shadowColor = 'rgba(255, 215, 0, 0.75)';
    ctx.shadowBlur = c.isShining ? 18 : 8;

    // Outer gold coin rim
    const grad = ctx.createLinearGradient(-radius, -radius, radius, radius);
    grad.addColorStop(0, '#fff4b8');
    grad.addColorStop(0.35, '#ffd700');
    grad.addColorStop(0.7, '#d4af37');
    grad.addColorStop(1, '#996515');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Inner rim line
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.82, 0, Math.PI * 2);
    ctx.stroke();

    // Korean Won Symbol: ₩
    ctx.fillStyle = '#6b4f00';
    ctx.font = `bold ${radius * 0.95}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('₩', 0, 1);

    // Specular shine glint
    if (c.isShining) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(-radius * 0.35, -radius * 0.35, radius * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // 3D Mesh: Front Man Low-Poly Faceted Mask
  initFrontManMesh() {
    // 3D vertices for the iconic faceted geometric mask
    this.maskVertices = [
      { x: 0, y: -90, z: 25 },     // 0: Crown tip
      { x: -45, y: -65, z: 15 },   // 1: Top left temple
      { x: 45, y: -65, z: 15 },    // 2: Top right temple
      { x: -65, y: -10, z: -10 },  // 3: Mid cheek left
      { x: 65, y: -10, z: -10 },   // 4: Mid cheek right
      { x: 0, y: -20, z: 45 },     // 5: Nose bridge peak
      { x: -35, y: 35, z: 10 },    // 6: Lower jaw left
      { x: 35, y: 35, z: 10 },     // 7: Lower jaw right
      { x: 0, y: 55, z: 30 },      // 8: Chin apex
      { x: 0, y: 85, z: 10 },      // 9: Chin base
      { x: -20, y: -25, z: 20 },   // 10: Eye socket left
      { x: 20, y: -25, z: 20 },    // 11: Eye socket right
    ];

    // Polygonal facets (triangles)
    this.maskFaces = [
      [0, 1, 5], [0, 5, 2],
      [1, 3, 5], [2, 5, 4],
      [1, 10, 5], [2, 11, 5],
      [3, 6, 5], [4, 5, 7],
      [5, 6, 8], [5, 8, 7],
      [6, 9, 8], [7, 8, 9]
    ];
  }

  drawFrontManMask(ctx, centerX, centerY, scale = 1.0) {
    ctx.save();
    ctx.translate(centerX, centerY);

    // Parallax 3D rotation based on mouse offset
    const rotY = (this.mouse.x - this.width / 2) * 0.0012;
    const rotX = -(this.mouse.y - this.height / 2) * 0.0012;

    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

    // Light source vector from top-left
    const light = { x: -0.5, y: -0.7, z: 0.6 };
    const lightMag = Math.sqrt(light.x * light.x + light.y * light.y + light.z * light.z);
    light.x /= lightMag; light.y /= lightMag; light.z /= lightMag;

    // Transform and project vertices
    const projected = this.maskVertices.map(v => {
      // Rotate Y
      let x1 = v.x * cosY + v.z * sinY;
      let y1 = v.y;
      let z1 = -v.x * sinY + v.z * cosY;

      // Rotate X
      let x2 = x1;
      let y2 = y1 * cosX - z1 * sinX;
      let z2 = y1 * sinX + z1 * cosX;

      const fov = 350;
      const pScale = (fov / (fov + z2 + 80)) * scale;
      return {
        x: x2 * pScale,
        y: y2 * pScale,
        z: z2,
        origZ: z2
      };
    });

    // Render triangular facets sorted by depth (painter's algorithm)
    const sortedFaces = this.maskFaces.map(face => {
      const p0 = projected[face[0]];
      const p1 = projected[face[1]];
      const p2 = projected[face[2]];
      const avgZ = (p0.z + p1.z + p2.z) / 3;

      // Calculate surface normal
      const v0x = p1.x - p0.x, v0y = p1.y - p0.y, v0z = p1.z - p0.z;
      const v1x = p2.x - p0.x, v1y = p2.y - p0.y, v1z = p2.z - p0.z;
      const nx = v0y * v1z - v0z * v1y;
      const ny = v0z * v1x - v0x * v1z;
      const nz = v0x * v1y - v0y * v1x;
      const nMag = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;

      const dot = (nx * light.x + ny * light.y + nz * light.z) / nMag;
      const intensity = Math.max(0.12, Math.min(0.95, (dot + 1) * 0.45));

      return { face, avgZ, intensity };
    }).sort((a, b) => b.avgZ - a.avgZ);

    sortedFaces.forEach(item => {
      const { face, intensity } = item;
      const p0 = projected[face[0]];
      const p1 = projected[face[1]];
      const p2 = projected[face[2]];

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.closePath();

      // Front man metallic sheen: shades of dark carbon and obsidian
      const colVal = Math.floor(18 + intensity * 65);
      const isRedAlert = this.gameState === 'RED';
      const r = isRedAlert ? Math.min(255, colVal + 75) : colVal;
      const g = isRedAlert ? Math.floor(colVal * 0.5) : colVal;
      const b = isRedAlert ? Math.floor(colVal * 0.6) : Math.floor(colVal * 1.15);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fill();

      // Sharp geometric facet edges
      ctx.strokeStyle = isRedAlert ? 'rgba(255, 0, 85, 0.65)' : 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    // Glowing Geometric Front Man Eyes
    const leftEye = projected[10];
    const rightEye = projected[11];
    const eyeGlowColor = this.gameState === 'RED' ? '#ff0055' : '#03dac5';

    [leftEye, rightEye].forEach(pt => {
      ctx.shadowColor = eyeGlowColor;
      ctx.shadowBlur = 15;
      ctx.fillStyle = eyeGlowColor;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3.5 * scale, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  // Giant Animatronic Young-hee Doll & Red/Green Light Mechanism
  drawYoungHeeDoll(ctx, centerX, centerY, scale = 1.0) {
    ctx.save();
    ctx.translate(centerX, centerY);

    // Smooth head rotation towards target angle
    this.dollHeadAngle += (this.targetDollAngle - this.dollHeadAngle) * 0.08;
    const isFacingFront = Math.abs(this.dollHeadAngle) < Math.PI * 0.35;

    // Body & Iconic Orange Collar + Yellow Dress
    const bodyWidth = 140 * scale;
    const bodyHeight = 160 * scale;

    // Yellow Dress
    ctx.fillStyle = '#f5c518';
    ctx.beginPath();
    ctx.moveTo(-bodyWidth * 0.35, 70 * scale);
    ctx.lineTo(bodyWidth * 0.35, 70 * scale);
    ctx.lineTo(bodyWidth * 0.65, 70 * scale + bodyHeight);
    ctx.lineTo(-bodyWidth * 0.65, 70 * scale + bodyHeight);
    ctx.closePath();
    ctx.fill();

    // Orange Inner Shirt / Collar
    ctx.fillStyle = '#e65100';
    ctx.beginPath();
    ctx.arc(0, 68 * scale, 38 * scale, 0, Math.PI);
    ctx.fill();

    // Twin Pigtails
    const hairBob = Math.sin(this.time * 2) * 2;
    ctx.fillStyle = '#111317';
    // Left Pigtail
    ctx.beginPath();
    ctx.ellipse(-65 * scale, 25 * scale + hairBob, 20 * scale, 35 * scale, 0.25, 0, Math.PI * 2);
    ctx.fill();
    // Right Pigtail
    ctx.beginPath();
    ctx.ellipse(65 * scale, 25 * scale + hairBob, 20 * scale, 35 * scale, -0.25, 0, Math.PI * 2);
    ctx.fill();

    // Doll Head (Rotatable)
    ctx.save();
    // Parallax head tilt based on mouse position
    const headTilt = (this.mouse.x - this.width / 2) * 0.0003;
    ctx.rotate(headTilt);

    // Head Base Skin
    ctx.fillStyle = '#fce2c8';
    ctx.beginPath();
    ctx.ellipse(0, 0, 58 * scale, 65 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    if (!isFacingFront) {
      // BACK OF HEAD (Green Light state: facing the giant tree)
      ctx.fillStyle = '#16191f';
      ctx.beginPath();
      ctx.ellipse(0, -6 * scale, 60 * scale, 62 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hair part line
      ctx.strokeStyle = '#2d3340';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -65 * scale);
      ctx.lineTo(0, 40 * scale);
      ctx.stroke();

      // Red hairpin ribbons
      ctx.fillStyle = '#ff0055';
      ctx.fillRect(-62 * scale, 12 * scale, 10 * scale, 10 * scale);
      ctx.fillRect(52 * scale, 12 * scale, 10 * scale, 10 * scale);

    } else {
      // FRONT OF HEAD (Red Light state: turning to eliminate moving players!)
      // Hair bangs (Straight fringe)
      ctx.fillStyle = '#16191f';
      ctx.beginPath();
      ctx.moveTo(-58 * scale, -15 * scale);
      ctx.bezierCurveTo(-40 * scale, -65 * scale, 40 * scale, -65 * scale, 58 * scale, -15 * scale);
      ctx.lineTo(58 * scale, -28 * scale);
      ctx.bezierCurveTo(40 * scale, -75 * scale, -40 * scale, -75 * scale, -58 * scale, -28 * scale);
      ctx.closePath();
      ctx.fill();

      // Bang fringe over forehead
      ctx.fillRect(-52 * scale, -48 * scale, 104 * scale, 26 * scale);

      // Rosy Cheeks
      ctx.fillStyle = 'rgba(255, 107, 107, 0.45)';
      ctx.beginPath();
      ctx.ellipse(-34 * scale, 18 * scale, 14 * scale, 8 * scale, 0, 0, Math.PI * 2);
      ctx.ellipse(34 * scale, 18 * scale, 14 * scale, 8 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eerie Stylized Doll Eyes
      const eyeXOffset = 26 * scale;
      const eyeY = -4 * scale;

      // Eye Whites
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-eyeXOffset, eyeY, 14 * scale, 11 * scale, 0, 0, Math.PI * 2);
      ctx.ellipse(eyeXOffset, eyeY, 14 * scale, 11 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Laser Pupil / Optical Sensor
      const eyeLookX = (this.mouse.x - centerX) * 0.012;
      const eyeLookY = (this.mouse.y - centerY) * 0.012;
      const eyeColor = this.gameState === 'RED' ? '#ff0055' : '#03dac5';

      [-eyeXOffset, eyeXOffset].forEach(ex => {
        // Iris
        ctx.fillStyle = eyeColor;
        ctx.shadowColor = eyeColor;
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(ex + eyeLookX, eyeY + eyeLookY, 7 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Digital Pupil Aperture
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(ex + eyeLookX, eyeY + eyeLookY, 3 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Specular glint
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ex + eyeLookX - 2, eyeY + eyeLookY - 2, 2 * scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Small Smile
      ctx.strokeStyle = '#c92a2a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 26 * scale, 12 * scale, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();

      // RED LIGHT LASER PROJECTION GRID
      if (this.gameState === 'RED') {
        this.drawLaserScanBeams(ctx, -eyeXOffset, eyeY, eyeXOffset, eyeY, scale);
      }
    }

    ctx.restore();
    ctx.restore();
  }

  // Surveillance Laser Scanning Beams
  drawLaserScanBeams(ctx, eye1X, eye1Y, eye2X, eye2Y, scale) {
    ctx.save();
    const beamTargetX = (this.mouse.x - this.width / 2);
    const beamTargetY = (this.mouse.y - this.height * 0.35);

    // Laser Beam Gradient
    const laserColor = 'rgba(255, 0, 85, ';

    [eye1X, eye2X].forEach(originX => {
      const grad = ctx.createRadialGradient(originX, eye1Y, 2, beamTargetX, beamTargetY, 280);
      grad.addColorStop(0, `${laserColor}0.85)`);
      grad.addColorStop(0.2, `${laserColor}0.35)`);
      grad.addColorStop(1, `${laserColor}0.0)`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(originX, eye1Y);
      ctx.lineTo(beamTargetX, beamTargetY);
      ctx.stroke();
    });

    // Sweeping floor scanlines
    const sweepY = (this.time * 280) % this.height;
    ctx.fillStyle = `${laserColor}0.12)`;
    ctx.fillRect(-this.width, sweepY - 120, this.width * 2, 4);

    ctx.restore();
  }

  // Giant Glass Piggy Bank Suspended by Chains
  drawPiggyBank(ctx, centerX, centerY, scale = 1.0) {
    ctx.save();
    ctx.translate(centerX, centerY);

    // Suspended Heavy Iron Chains from Ceiling
    ctx.strokeStyle = '#545969';
    ctx.lineWidth = 4 * scale;
    ctx.beginPath();
    ctx.moveTo(-90 * scale, -centerY);
    ctx.lineTo(-70 * scale, -45 * scale);
    ctx.moveTo(90 * scale, -centerY);
    ctx.lineTo(70 * scale, -45 * scale);
    ctx.stroke();

    // Chains Links
    for (let y = -centerY; y < -45 * scale; y += 22 * scale) {
      ctx.strokeRect(-90 * scale + (y + centerY) * 0.05, y, 8 * scale, 14 * scale);
      ctx.strokeRect(82 * scale - (y + centerY) * 0.05, y, 8 * scale, 14 * scale);
    }

    // Glass Piggy Bank Body (Transparent Bulbous Glass Sphere/Egg)
    const pigWidth = 140 * scale;
    const pigHeight = 110 * scale;

    // Glowing Golden Caustic Core inside the glass
    const goldGlow = ctx.createRadialGradient(0, 15 * scale, 10 * scale, 0, 0, pigWidth);
    goldGlow.addColorStop(0, 'rgba(255, 235, 120, 0.7)');
    goldGlow.addColorStop(0.35, 'rgba(255, 200, 0, 0.45)');
    goldGlow.addColorStop(0.7, 'rgba(255, 160, 0, 0.18)');
    goldGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = goldGlow;
    ctx.beginPath();
    ctx.ellipse(0, 0, pigWidth, pigHeight, 0, 0, Math.PI * 2);
    ctx.fill();

    // Snout
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.ellipse(pigWidth * 0.88, 10 * scale, 22 * scale, 18 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Nostrils
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.ellipse(pigWidth * 0.88 - 5 * scale, 10 * scale, 4 * scale, 6 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(pigWidth * 0.88 + 5 * scale, 10 * scale, 4 * scale, 6 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Little Glass Ears
    ctx.beginPath();
    ctx.moveTo(-50 * scale, -pigHeight * 0.75);
    ctx.lineTo(-30 * scale, -pigHeight * 1.15);
    ctx.lineTo(-10 * scale, -pigHeight * 0.8);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fill();
    ctx.stroke();

    // Glass Rim & Specular Caustics
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 3.5 * scale;
    ctx.beginPath();
    ctx.ellipse(0, 0, pigWidth, pigHeight, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Top Coin Slot
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(-28 * scale, -pigHeight * 0.98, 56 * scale, 6 * scale);

    // Specular Curved Glass Reflection Arc
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 4 * scale;
    ctx.beginPath();
    ctx.arc(0, 0, pigWidth * 0.88, -0.75 * Math.PI, -0.35 * Math.PI);
    ctx.stroke();

    // Floating Golden Coins INSIDE the Piggy Bank
    for (let i = 0; i < 28; i++) {
      const cx = (Math.sin(i * 1.7 + this.time * 0.8) * 0.65) * pigWidth;
      const cy = (Math.cos(i * 2.3 + this.time * 0.6) * 0.45 + 0.25) * pigHeight;
      const cSize = (Math.sin(i * 3.1) * 3 + 8) * scale;
      
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, 0, cSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  // M.C. Escher Impossible Staircase Architecture
  drawEscherStairs(ctx, offsetX, offsetY, scale = 1.0) {
    ctx.save();
    ctx.translate(offsetX, offsetY);

    // Pastel Palette from Squid Game Dormitory Maze
    const pinkWall = '#ff4d84';
    const tealStair = '#00cbb4';
    const yellowWall = '#f9d342';
    const darkStair = '#252936';

    const stepW = 32 * scale;
    const stepH = 18 * scale;

    // Draw multi-directional ascending/descending isometric stair loops
    const stairPaths = [
      // Flight 1: Ascending Right
      { x: -160, y: 80, dx: 1, dy: -0.7, steps: 6, col: tealStair },
      // Flight 2: Horizontal Transverse
      { x: 30, y: 0, dx: 1, dy: 0.7, steps: 6, col: pinkWall },
      // Flight 3: Impossible Descending Loop
      { x: 190, y: 80, dx: -1, dy: 0.7, steps: 6, col: yellowWall },
      // Flight 4: Underpass Staircase
      { x: 0, y: 160, dx: -1, dy: -0.7, steps: 6, col: darkStair }
    ];

    stairPaths.forEach(path => {
      ctx.fillStyle = path.col;
      for (let s = 0; s < path.steps; s++) {
        const sx = path.x * scale + s * stepW * path.dx;
        const sy = path.y * scale + s * stepH * path.dy;

        // Isometric Step Tread
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + stepW * path.dx, sy);
        ctx.lineTo(sx + stepW * path.dx, sy + stepH);
        ctx.lineTo(sx, sy + stepH);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Architectural wall segment below steps
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(sx, sy + stepH, stepW, 25 * scale);
      }
    });

    // Tiny Guard Silhouettes with Circle, Triangle, Square masks walking on stairs
    const guardTime = (this.time * 0.8) % 4;
    const guardPos = [
      { x: -100 * scale + (this.time * 20) % (120 * scale), y: 40 * scale, sym: '○' },
      { x: 120 * scale - (this.time * 18) % (120 * scale), y: 45 * scale, sym: '△' },
      { x: (Math.sin(this.time) * 40) * scale, y: 140 * scale, sym: '□' }
    ];

    guardPos.forEach(g => {
      // Pink Hooded Guard Suit
      ctx.fillStyle = '#ff0055';
      ctx.beginPath();
      ctx.ellipse(g.x, g.y - 12 * scale, 6 * scale, 8 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      // Body
      ctx.fillRect(g.x - 5 * scale, g.y - 6 * scale, 10 * scale, 18 * scale);

      // Black Mask with White Symbol
      ctx.fillStyle = '#0a0a0c';
      ctx.beginPath();
      ctx.arc(g.x, g.y - 12 * scale, 4 * scale, 0, Math.PI * 2);
      ctx.fill();

      // White Guard Mask Symbol (Circle, Triangle, Square)
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${5 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(g.sym, g.x, g.y - 12 * scale);
    });

    ctx.restore();
  }

  // Sacred Geometry: Morphing Circle, Triangle, Square Mandala
  drawSacredGeometry(ctx, centerX, centerY, scale = 1.0) {
    ctx.save();
    ctx.translate(centerX, centerY);

    const rot = this.time * 0.45;
    const pulse = Math.sin(this.time * 1.5) * 0.15 + 1.0;

    // Glowing Neon Rings
    const symbols = [
      { type: 'circle', radius: 140 * scale * pulse, color: '#ff0055', rot: rot },
      { type: 'triangle', radius: 100 * scale * pulse, color: '#ffffff', rot: -rot * 0.8 },
      { type: 'square', radius: 65 * scale * pulse, color: '#03dac5', rot: rot * 1.2 }
    ];

    symbols.forEach(sym => {
      ctx.save();
      ctx.rotate(sym.rot);
      ctx.strokeStyle = sym.color;
      ctx.shadowColor = sym.color;
      ctx.shadowBlur = 20;
      ctx.lineWidth = 3.5;

      if (sym.type === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, sym.radius, 0, Math.PI * 2);
        ctx.stroke();

        // 12 Orbital particle nodes around circle
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          const px = Math.cos(angle) * sym.radius;
          const py = Math.sin(angle) * sym.radius;
          ctx.fillStyle = sym.color;
          ctx.beginPath();
          ctx.arc(px, py, 3.5 * scale, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (sym.type === 'triangle') {
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
          const px = Math.cos(angle) * sym.radius;
          const py = Math.sin(angle) * sym.radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

      } else if (sym.type === 'square') {
        const half = sym.radius * 0.7;
        ctx.strokeRect(-half, -half, half * 2, half * 2);
      }

      ctx.restore();
    });

    ctx.restore();
  }

  // Telemetry: ECG Heartbeat Generator
  updateEcg() {
    if (!this.ecgCtx) return;
    const w = this.ecgCanvas.width;
    const h = this.ecgCanvas.height;

    if (this.ecgPoints.length === 0) {
      for (let i = 0; i < w; i++) this.ecgPoints.push(h / 2);
    }

    const t = this.frameCount;
    let nextY = h / 2;

    const cycle = t % 45;
    if (cycle === 12) nextY = h / 2 - 4;
    else if (cycle === 14) nextY = h / 2 + 6;
    else if (cycle === 16) nextY = h * 0.15; // R peak spike!
    else if (cycle === 18) nextY = h * 0.85; // S valley
    else if (cycle === 22) nextY = h / 2 - 5;
    else nextY = h / 2 + (Math.random() - 0.5) * 2;

    this.ecgPoints.push(nextY);
    if (this.ecgPoints.length > w) {
      this.ecgPoints.shift();
    }

    // Render ECG
    this.ecgCtx.clearRect(0, 0, w, h);
    this.ecgCtx.strokeStyle = this.gameState === 'RED' ? '#ff0055' : '#03dac5';
    this.ecgCtx.lineWidth = 1.8;
    this.ecgCtx.beginPath();
    for (let i = 0; i < this.ecgPoints.length; i++) {
      if (i === 0) this.ecgCtx.moveTo(i, this.ecgPoints[i]);
      else this.ecgCtx.lineTo(i, this.ecgPoints[i]);
    }
    this.ecgCtx.stroke();
  }

  // Audio Spectrum Bar Update
  updateAudioVisualizer() {
    if (!this.audioSpectrumBar || !window.soundEngine) return;
    const data = window.soundEngine.getFrequencyData();
    let sum = 0;
    for (let i = 0; i < 16; i++) sum += data[i];
    const avg = sum / 16;
    const scaleY = Math.max(1, (avg / 255) * 8);
    this.audioSpectrumBar.style.transform = `scaleY(${scaleY})`;
    this.audioSpectrumBar.style.opacity = Math.max(0.3, avg / 180);
  }

  // Master Render Loop
  render(timestamp) {
    const dt = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;
    this.time += dt;
    this.frameCount++;

    // Smooth mouse interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.1;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.1;

    // Check player motion during RED LIGHT
    const timeSinceMove = Date.now() - this.lastMouseMove;
    const isMoving = timeSinceMove < 150 && this.mouse.speed > 3;

    if (this.motionStatus) {
      if (this.gameState === 'RED') {
        if (isMoving) {
          this.motionStatus.textContent = 'MOTION DETECTED ⚠️';
          this.motionStatus.className = 'vital-val accent-pink';
          if (this.crosshairLabel) this.crosshairLabel.textContent = 'MOTION DETECTED: [ELIMINATION LOCK]';
        } else {
          this.motionStatus.textContent = 'STATIONARY (SAFE)';
          this.motionStatus.className = 'vital-val active-green';
          if (this.crosshairLabel) this.crosshairLabel.textContent = 'TARGET HOLD: [P-456 FREEZE]';
        }
      } else {
        this.motionStatus.textContent = isMoving ? 'ADVANCING' : 'STATIONARY';
        this.motionStatus.className = 'vital-val active-green';
        if (this.crosshairLabel) this.crosshairLabel.textContent = 'TARGET MONITORED: [P-456]';
      }
    }

    // Dynamic Prize Counter increment smoothing
    if (this.piggyWonAmount < this.targetPrizeAmount) {
      this.piggyWonAmount += Math.ceil((this.targetPrizeAmount - this.piggyWonAmount) * 0.1);
      if (this.prizeDisplay) {
        this.prizeDisplay.textContent = `₩ ${this.piggyWonAmount.toLocaleString('ko-KR')}`;
      }
    }

    // Canvas Background
    this.ctx.fillStyle = '#07080d';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw Subtle Floor Perspective Grid
    this.drawPerspectiveFloor();

    // Scene Selection Rendering
    const cx = this.width / 2;
    const cy = this.height / 2;

    if (this.currentMode === 'all') {
      // 1. MASTERWORK CINEMATIC COMPOSITION
      // Flanking Escher Labyrinths (Left and Right)
      this.drawEscherStairs(this.ctx, this.width * 0.16, this.height * 0.58, 0.85);
      this.drawEscherStairs(this.ctx, this.width * 0.84, this.height * 0.58, -0.85);

      // Sacred Geometry Center Matrix Background
      this.drawSacredGeometry(this.ctx, cx, cy - 30, 1.25);

      // Suspended Golden Piggy Bank (Center Top)
      this.drawPiggyBank(this.ctx, cx, this.height * 0.22, 0.95);

      // Giant Young-hee Doll (Foreground Center)
      this.drawYoungHeeDoll(this.ctx, cx, this.height * 0.62, 1.15);

      // Front Man Hologram Visage (Hovering above the doll)
      this.drawFrontManMask(this.ctx, cx, this.height * 0.40, 0.75);

    } else if (this.currentMode === 'doll') {
      // 2. YOUNG-HEE PANOPTICON FOCUS
      this.drawYoungHeeDoll(this.ctx, cx, this.height * 0.52, 1.8);
      this.drawFrontManMask(this.ctx, cx, this.height * 0.18, 0.65);

    } else if (this.currentMode === 'piggy') {
      // 3. 45.6 BILLION WON CASCADE FOCUS
      this.drawPiggyBank(this.ctx, cx, this.height * 0.35, 1.8);

    } else if (this.currentMode === 'geometry') {
      // 4. SACRED GEOMETRY & FRONT MAN FOCUS
      this.drawSacredGeometry(this.ctx, cx, cy, 2.0);
      this.drawFrontManMask(this.ctx, cx, cy, 1.4);

    } else if (this.currentMode === 'stairs') {
      // 5. ESCHER LABYRINTH FOCUS
      this.drawEscherStairs(this.ctx, cx, cy, 1.8);
    }

    // Physics Coin Simulation Rendering
    this.updateCoins();
    for (let i = 0; i < this.coins.length; i++) {
      this.drawCoin(this.ctx, this.coins[i]);
    }

    // Telemetry updates
    this.updateEcg();
    this.updateAudioVisualizer();

    requestAnimationFrame(this.render.bind(this));
  }

  // Floor Perspective Grid with Glowing Horizon
  drawPerspectiveFloor() {
    this.ctx.save();
    const horizonY = this.height * 0.65;
    const vpX = this.width / 2;

    // Gradient fade from horizon to bottom
    const floorGrad = this.ctx.createLinearGradient(0, horizonY, 0, this.height);
    floorGrad.addColorStop(0, 'rgba(10, 12, 18, 0.2)');
    floorGrad.addColorStop(1, 'rgba(14, 18, 28, 0.9)');
    this.ctx.fillStyle = floorGrad;
    this.ctx.fillRect(0, horizonY, this.width, this.height - horizonY);

    // Grid lines
    this.ctx.strokeStyle = this.gameState === 'RED' ? 'rgba(255, 0, 85, 0.15)' : 'rgba(3, 218, 197, 0.12)';
    this.ctx.lineWidth = 1;

    // Transverse lines
    for (let y = horizonY + 10; y < this.height; y += (y - horizonY) * 0.35 + 8) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    // Radial perspective lines converging to horizon center
    for (let x = -this.width * 0.5; x <= this.width * 1.5; x += this.width * 0.08) {
      this.ctx.beginPath();
      this.ctx.moveTo(vpX, horizonY);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  // 4K High-Resolution Screenshot Export Engine
  export4KArtwork() {
    this.showToast('GENERATING 4K HIGH-RES ARTWORK...');

    // Offscreen 4K Canvas (3840 x 2160)
    const exportWidth = 3840;
    const exportHeight = 2160;
    const expCanvas = document.createElement('canvas');
    expCanvas.width = exportWidth;
    expCanvas.height = exportHeight;
    const expCtx = expCanvas.getContext('2d');

    // Scale context to 4K resolution
    const scaleFactor = exportWidth / this.width;
    expCtx.scale(scaleFactor, scaleFactor);

    // 1. Dark Void Background
    expCtx.fillStyle = '#07080d';
    expCtx.fillRect(0, 0, this.width, this.height);

    // 2. Render Floor Grid
    this.drawPerspectiveFloor();

    // 3. Render Master Composition
    const cx = this.width / 2;
    const cy = this.height / 2;

    this.drawEscherStairs(expCtx, this.width * 0.16, this.height * 0.58, 0.85);
    this.drawEscherStairs(expCtx, this.width * 0.84, this.height * 0.58, -0.85);
    this.drawSacredGeometry(expCtx, cx, cy - 30, 1.25);
    this.drawPiggyBank(expCtx, cx, this.height * 0.22, 0.95);
    this.drawYoungHeeDoll(expCtx, cx, this.height * 0.62, 1.15);
    this.drawFrontManMask(expCtx, cx, this.height * 0.40, 0.75);

    // 4. Render Golden Coins
    for (let i = 0; i < this.coins.length; i++) {
      this.drawCoin(expCtx, this.coins[i]);
    }

    // 5. High-Resolution Official Typography & Contest Badge
    expCtx.save();

    // Top Header Badge
    expCtx.fillStyle = '#ff0055';
    expCtx.font = 'bold 36px Orbitron, sans-serif';
    expCtx.fillText('CODE ART ATTACK 2026 // SQUID GAME', 70, 90);

    expCtx.fillStyle = '#ffffff';
    expCtx.font = '22px Orbitron, sans-serif';
    expCtx.fillText('PROJECT 456: ARCHITECTURE OF SURVIVAL', 70, 130);

    // Sacred Symbol Badge
    expCtx.fillStyle = '#03dac5';
    expCtx.font = 'bold 36px sans-serif';
    expCtx.fillText('○ △ □  오징어 게임', 70, 180);

    // Center Prize Ticker
    expCtx.textAlign = 'center';
    expCtx.fillStyle = '#cbd5e1';
    expCtx.font = '18px Orbitron, sans-serif';
    expCtx.fillText('TOTAL PRIZE POOL', cx, 80);

    expCtx.fillStyle = '#ffd700';
    expCtx.shadowColor = 'rgba(255, 215, 0, 0.8)';
    expCtx.shadowBlur = 25;
    expCtx.font = 'bold 48px Orbitron, sans-serif';
    expCtx.fillText('₩ 45,600,000,000', cx, 140);
    expCtx.shadowBlur = 0;

    // Right Verification & Metadata
    expCtx.textAlign = 'right';
    expCtx.fillStyle = '#94a3b8';
    expCtx.font = '16px Orbitron, monospace';
    const timestampStr = new Date().toISOString();
    expCtx.fillText(`TIMESTAMP: ${timestampStr}`, this.width - 70, 80);
    expCtx.fillStyle = '#03dac5';
    expCtx.fillText('SUBJECT: SEONG GI-HUN [PLAYER 456]', this.width - 70, 115);
    expCtx.fillStyle = '#ff0055';
    expCtx.fillText('STATUS: SURVIVOR // ALL GAMES COMPLETED', this.width - 70, 150);

    // Bottom Artist Verification Stamp
    expCtx.textAlign = 'left';
    expCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    expCtx.font = '14px Orbitron, sans-serif';
    expCtx.fillText('GENERATIVE ARTWORK CREATED IN HTML5 CANVAS & WEB AUDIO API', 70, this.height - 40);

    expCtx.textAlign = 'right';
    expCtx.fillText('OFFICIAL SUBMISSION FORM: https://forms.gle/kDchD4Txeh4D3rxD6', this.width - 70, this.height - 40);

    expCtx.restore();

    // Trigger Download
    const dataUrl = expCanvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = 'Squid_Game_Code_Art_Attack_2026_Player456.png';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast('4K ARTWORK EXPORTED SUCCESSFULLY! 📸');
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.squidArt = new SquidGameArt();
});
