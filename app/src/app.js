/**
 * 🪔 Shubh Deepavali — Festive Microservice Application Logic
 * 
 * Features:
 *  1. Interactive Login with "Tricky Password" rule based on name length:
 *     - Name 'kubendhiran' has 11 letters -> Countdown of last 3 numbers (11, 10, 09) = 111009
 *  2. Interactive Diwali Cracker / Bomb with fuse ignition, realistic Web Audio synthesis
 *  3. Dynamic Canvas Fireworks particle system (zero external assets needed)
 *  4. Personalized greeting revelation: "Happy Diwali Kubendhiran!"
 *  5. Session management & clean Logout returning to Home/Login
 */

// =============================================================================
// 1. Audio Synthesizer (Pure Web Audio API — No external audio files needed)
// =============================================================================
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Sizzling spark fuse sound
  playFuse() {
    try {
      this.init();
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 0.6;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Crackling noise with intermittent spikes
        const crackle = Math.random() > 0.85 ? Math.random() * 2 - 1 : (Math.random() * 0.3 - 0.15);
        data[i] = crackle;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, this.ctx.currentTime);
      filter.Q.setValueAtTime(4.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch (e) {
      console.warn('Audio synthesis unavailable:', e);
    }
  }

  // Deep resonant bomb explosion with noise burst
  playBoom() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Low Frequency Sub-Bass Thud (Oscillator drop)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.7);

      oscGain.gain.setValueAtTime(0.8, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);

      // 2. High-energy explosion noise blast
      const bufferSize = this.ctx.sampleRate * 0.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3500, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 0.8);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.9, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.8);
    } catch (e) {
      console.warn('Explosion audio synthesis unavailable:', e);
    }
  }

  // Festive celebration chime
  playCelebration() {
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + idx * 0.09;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.8);
      });
    } catch (e) {
      console.warn('Chime audio synthesis unavailable:', e);
    }
  }
}

const sfx = new SoundFX();

// =============================================================================
// 2. Fireworks Particle Engine (HTML5 Canvas)
// =============================================================================
class FireworksEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.ambientSparkles = [];
    this.colors = [
      '#ffc107', '#ff3d00', '#ff007f', '#00e5ff', 
      '#76ff03', '#ffd600', '#e040fb', '#ffffff'
    ];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  explode(x, y, count = 140) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 2;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.01,
        color: color,
        size: Math.random() * 3.5 + 2,
        gravity: 0.12,
        drag: 0.96
      });
    }
  }

  loop() {
    if (!this.ctx || !this.canvas) return;

    // Gentle trail fade
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update & draw explosion particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(p.alpha, 0);
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // Occasional gentle ambient background sparkles
    if (Math.random() < 0.15 && this.particles.length < 200) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height * 0.7,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.8 - 0.2,
        alpha: 0.8,
        decay: 0.015,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        size: Math.random() * 2 + 1,
        gravity: -0.01,
        drag: 0.99
      });
    }

    requestAnimationFrame(this.loop);
  }
}

// =============================================================================
// 3. Application State & Tricky Password Logic
// =============================================================================
const APP_STATE = {
  currentUser: 'kubendhiran',
  isAuthenticated: false,
  isCrackerExploded: false
};

/**
 * Computes tricky password based on letter count rule:
 * For 'kubendhiran' (11 letters) -> countdown of last 3 numbers (11, 10, 09) = 111009
 */
function computeTrickyPassword(rawName) {
  const lettersOnly = (rawName || '').trim().replace(/[^a-zA-Z]/g, '');
  const len = lettersOnly.length || 11;
  const n1 = len;
  const n2 = Math.max(len - 1, 0);
  const n3 = Math.max(len - 2, 0);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(n1)}${pad(n2)}${pad(n3)}`;
}

/**
 * Validates entered credentials.
 * Kubendhiran's master password '111009' is ALWAYS accepted!
 */
function validateCredentials(username, password) {
  const trimmedUser = (username || 'kubendhiran').trim();
  const trimmedPass = (password || '').trim();

  if (!trimmedPass) return false;

  // Master key for Kubendhiran: 111009 always succeeds!
  if (trimmedPass === '111009') return true;

  // Check computed countdown rule for custom username
  const expectedPass = computeTrickyPassword(trimmedUser);
  return trimmedPass === expectedPass;
}

// =============================================================================
// 4. Main Event Listeners & UI Controller
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const fireworks = new FireworksEngine('fireworks-canvas');

  const loginSection = document.getElementById('login-section');
  const celebrationSection = document.getElementById('celebration-section');
  const loginForm = document.getElementById('login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const loginError = document.getElementById('login-error');

  const displayUser = document.getElementById('display-user');
  const diwaliHeadline = document.getElementById('diwali-headline');
  const logoutBtn = document.getElementById('logout-btn');

  const crackerStation = document.getElementById('cracker-station');
  const crackerTrigger = document.getElementById('cracker-trigger');
  const revealedGreetingBox = document.getElementById('revealed-greeting-box');
  const burstAgainBtn = document.getElementById('burst-again-btn');

  // Toggle Password Visibility
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      togglePasswordBtn.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  // Handle Login
  function handleLogin() {
    const rawUser = usernameInput ? usernameInput.value.trim() : '';
    const user = rawUser || 'kubendhiran';
    const pass = passwordInput ? passwordInput.value.trim() : '';

    if (!pass) {
      showError('Please enter your security password (Hint: 111009).');
      return;
    }

    if (validateCredentials(user, pass)) {
      // Clear errors
      if (loginError) loginError.style.display = 'none';

      // Update State
      APP_STATE.currentUser = user;
      APP_STATE.isAuthenticated = true;

      // Update UI displays with personalized user name
      const formattedName = user.charAt(0).toUpperCase() + user.slice(1);
      if (displayUser) displayUser.textContent = user;
      if (diwaliHeadline) diwaliHeadline.textContent = `Happy Diwali, ${formattedName}!`;

      // Switch Screens smoothly
      loginSection.style.display = 'none';
      celebrationSection.style.display = 'block';

      // Reset cracker to ready state
      resetCracker();

      // Soft welcoming fireworks burst
      fireworks.explode(window.innerWidth / 2, window.innerHeight * 0.35, 60);
    } else {
      const hint = computeTrickyPassword(user);
      showError(`Incorrect password! Tricky rule: For "${user}" (${user.replace(/[^a-zA-Z]/g, '').length || 11} letters), password is ${hint} (or master: 111009).`);
    }
  }

  function showError(msg) {
    if (loginError) {
      loginError.textContent = msg;
      loginError.style.display = 'block';
      // Trigger shake animation replay
      loginError.classList.remove('shake');
      void loginError.offsetWidth; // Reflow
      loginError.classList.add('shake');
    }
  }

  // Login Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLogin();
    });
  }

  // Handle Enter key on inputs
  if (passwordInput) {
    passwordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleLogin();
      }
    });
  }

  // Reset Cracker to Ready State
  function resetCracker() {
    APP_STATE.isCrackerExploded = false;
    if (crackerTrigger) {
      crackerTrigger.classList.remove('is-burning');
    }
    if (crackerStation) {
      crackerStation.style.display = 'flex';
    }
    if (revealedGreetingBox) {
      revealedGreetingBox.style.display = 'none';
    }
  }

  // Cracker Bomb Click & Explosion Sequence
  function igniteCracker() {
    if (APP_STATE.isCrackerExploded) return;
    if (crackerTrigger.classList.contains('is-burning')) return;

    // 1. Start burning fuse & play sizzle sound
    crackerTrigger.classList.add('is-burning');
    sfx.playFuse();

    // 2. Countdown to explosion (650ms fuse burn)
    setTimeout(() => {
      // Explode!
      APP_STATE.isCrackerExploded = true;
      sfx.playBoom();

      // Screen shake effect
      document.body.classList.add('screen-shake');
      setTimeout(() => document.body.classList.remove('screen-shake'), 450);

      // Find cracker center coordinates for pinpoint fireworks explosion
      const rect = crackerTrigger.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      // Massive canvas explosion
      fireworks.explode(originX, originY, 160);
      setTimeout(() => fireworks.explode(originX - 60, originY - 40, 80), 120);
      setTimeout(() => fireworks.explode(originX + 60, originY - 40, 80), 220);

      // Hide cracker and reveal Diwali Greeting Card
      if (crackerStation) crackerStation.style.display = 'none';
      if (revealedGreetingBox) {
        revealedGreetingBox.style.display = 'block';
      }

      // Play joyful celebration chime
      setTimeout(() => sfx.playCelebration(), 200);
    }, 650);
  }

  if (crackerTrigger) {
    crackerTrigger.addEventListener('click', igniteCracker);
    crackerTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        igniteCracker();
      }
    });
  }

  // "Crack Another One!" button
  if (burstAgainBtn) {
    burstAgainBtn.addEventListener('click', () => {
      resetCracker();
      // Mini sparkle burst
      fireworks.explode(window.innerWidth / 2, window.innerHeight * 0.45, 50);
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      APP_STATE.isAuthenticated = false;
      if (passwordInput) passwordInput.value = '';
      if (loginError) loginError.style.display = 'none';

      celebrationSection.style.display = 'none';
      loginSection.style.display = 'block';
      resetCracker();
    });
  }
});
