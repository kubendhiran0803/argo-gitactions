/**
 * AURA PRODUCTIVITY WORKSPACE — Core Application Logic
 * Pure ES6+ JavaScript. No dependencies, zero latency.
 */

// ===================================================================
// State & Storage Keys
// ===================================================================
const STORAGE_KEYS = {
  THEME: 'aura_theme',
  TASKS: 'aura_tasks',
  NOTES: 'aura_notes',
  CHIME: 'aura_chime_enabled',
  SESSIONS: 'aura_completed_sessions'
};

const quotes = [
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Focus is a muscle. The more you practice single-tasking, the stronger it gets.", author: "Cal Newport" },
  { text: "Do fewer things, work at a natural pace, and obsess over quality.", author: "Slow Productivity" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
  { text: "Flow is being completely involved in an activity for its own sake.", author: "Mihaly Csikszentmihalyi" }
];

// ===================================================================
// Toast Notification System
// ===================================================================
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// ===================================================================
// 1. Clock, Date & Contextual Greeting
// ===================================================================
function updateClockAndGreeting() {
  const now = new Date();
  
  // Format Time
  const timeElem = document.getElementById('live-clock');
  if (timeElem) {
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeElem.textContent = `${hours}:${minutes}:${seconds}`;
  }

  // Format Date
  const dateElem = document.getElementById('live-date');
  if (dateElem) {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    dateElem.textContent = now.toLocaleDateString('en-US', options);
  }

  // Contextual Greeting
  const greetingTitle = document.getElementById('greeting-title');
  const greetingSubtitle = document.getElementById('greeting-subtitle');
  if (greetingTitle && greetingSubtitle) {
    const hour = now.getHours();
    let greeting = "Good evening";
    let sub = "Wind down and organize tomorrow's inspirations.";

    if (hour >= 5 && hour < 12) {
      greeting = "Good morning";
      sub = "A fresh canvas awaits. Embrace today with calm intention.";
    } else if (hour >= 12 && hour < 17) {
      greeting = "Good afternoon";
      sub = "Stay focused on your most impactful priorities.";
    } else if (hour >= 17 && hour < 22) {
      greeting = "Good evening";
      sub = "Cultivate deep focus, track milestones, and create with calm.";
    } else {
      greeting = "Quiet Night";
      sub = "Night brings stillness. Rest your thoughts or flow gently.";
    }

    greetingTitle.textContent = greeting;
    greetingSubtitle.textContent = sub;
  }
}

// ===================================================================
// 2. Inspirational Quotes
// ===================================================================
function setupQuotes() {
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  const refreshBtn = document.getElementById('refresh-quote-btn');

  let currentIndex = 0;

  function renderQuote(index) {
    if (!quoteText || !quoteAuthor) return;
    const q = quotes[index % quotes.length];
    quoteText.style.opacity = 0;
    quoteAuthor.style.opacity = 0;
    
    setTimeout(() => {
      quoteText.textContent = `"${q.text}"`;
      quoteAuthor.textContent = `— ${q.author}`;
      quoteText.style.opacity = 1;
      quoteAuthor.style.opacity = 1;
    }, 180);
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % quotes.length;
      renderQuote(currentIndex);
    });
  }

  // Initialize random quote
  currentIndex = Math.floor(Math.random() * quotes.length);
  renderQuote(currentIndex);
}

// ===================================================================
// 3. Theme Switcher
// ===================================================================
function setupThemeSwitcher() {
  const themeButtons = document.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'celestial';

  function applyTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem(STORAGE_KEYS.THEME, themeName);

    themeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeName === themeName);
    });
  }

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.themeName);
    });
  });

  applyTheme(savedTheme);
}

// ===================================================================
// 4. Web Audio Chime & Procedural Soundscapes
// ===================================================================
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Pleasant bell/tibetan bowl chime when timer finishes
function playChimeSound() {
  const chimeToggle = document.getElementById('chime-toggle');
  if (chimeToggle && !chimeToggle.checked) return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Harmonic frequencies for zen singing bowl tone
    const freqs = [528, 1056, 1584];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25 / (idx + 1), now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.8);
    });
  } catch (err) {
    console.warn('Audio chime notice:', err);
  }
}

// Procedural Ambient Soundscape Engine (Pure math & noise buffers)
class SoundGenerator {
  constructor() {
    this.activeNodes = {
      rain: null,
      binaural: null,
      stream: null
    };
  }

  // Create White/Pink Noise Buffer
  createNoiseBuffer(ctx, type = 'pink') {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else {
      // White noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.2;
      }
    }
    return buffer;
  }

  startRain(volume = 0.5) {
    this.stop('rain');
    const ctx = getAudioContext();
    const noiseBuffer = this.createNoiseBuffer(ctx, 'pink');

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Filter to simulate raindrops on leaves / glass
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    this.activeNodes.rain = { source, gain, filter };
  }

  startBinaural(volume = 0.5) {
    this.stop('binaural');
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Carrier frequency (110 Hz) + Theta beat offset (6 Hz)
    const oscLeft = ctx.createOscillator();
    const oscRight = ctx.createOscillator();
    oscLeft.type = 'sine';
    oscRight.type = 'sine';
    oscLeft.frequency.setValueAtTime(110, now);
    oscRight.frequency.setValueAtTime(116, now);

    const merger = ctx.createChannelMerger(2);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.25, now);

    oscLeft.connect(merger, 0, 0);
    oscRight.connect(merger, 0, 1);
    merger.connect(gain);
    gain.connect(ctx.destination);

    oscLeft.start();
    oscRight.start();

    this.activeNodes.binaural = { oscLeft, oscRight, gain };
  }

  startStream(volume = 0.5) {
    this.stop('stream');
    const ctx = getAudioContext();
    const noiseBuffer = this.createNoiseBuffer(ctx, 'white');

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Velvet lowpass
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.35, ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    this.activeNodes.stream = { source, gain, filter };
  }

  setVolume(soundType, volume) {
    const node = this.activeNodes[soundType];
    if (node && node.gain) {
      const ctx = getAudioContext();
      const mult = soundType === 'binaural' ? 0.25 : 0.4;
      node.gain.gain.linearRampToValueAtTime(volume * mult, ctx.currentTime + 0.05);
    }
  }

  stop(soundType) {
    const node = this.activeNodes[soundType];
    if (node) {
      try {
        if (node.source) node.source.stop();
        if (node.oscLeft) node.oscLeft.stop();
        if (node.oscRight) node.oscRight.stop();
      } catch (e) {
        // Already stopped
      }
      this.activeNodes[soundType] = null;
    }
  }

  stopAll() {
    ['rain', 'binaural', 'stream'].forEach(s => this.stop(s));
  }

  isPlaying(soundType) {
    return Boolean(this.activeNodes[soundType]);
  }

  isAnyPlaying() {
    return Object.values(this.activeNodes).some(n => Boolean(n));
  }
}

const soundGenerator = new SoundGenerator();

function setupAmbientSounds() {
  const sounds = ['rain', 'binaural', 'stream'];
  const activeBadge = document.getElementById('audio-active-badge');
  const stopAllBtn = document.getElementById('stop-all-audio-btn');

  function updateBadge() {
    if (!activeBadge) return;
    const isPlaying = soundGenerator.isAnyPlaying();
    activeBadge.textContent = isPlaying ? 'Active' : 'Off';
    activeBadge.classList.toggle('playing', isPlaying);
  }

  sounds.forEach(type => {
    const row = document.querySelector(`.sound-row[data-sound="${type}"]`);
    const btn = document.getElementById(`btn-sound-${type}`);
    const slider = document.getElementById(`volume-${type}`);

    if (!row || !btn || !slider) return;

    btn.addEventListener('click', () => {
      const isCurrentlyPlaying = soundGenerator.isPlaying(type);
      if (isCurrentlyPlaying) {
        soundGenerator.stop(type);
        row.classList.remove('is-playing');
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
      } else {
        // If slider is 0, give it a default 50%
        if (slider.value === '0') {
          slider.value = '50';
        }
        const vol = slider.value / 100;
        if (type === 'rain') soundGenerator.startRain(vol);
        if (type === 'binaural') soundGenerator.startBinaural(vol);
        if (type === 'stream') soundGenerator.startStream(vol);

        row.classList.add('is-playing');
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
      }
      updateBadge();
    });

    slider.addEventListener('input', (e) => {
      const val = e.target.value / 100;
      if (val === 0 && soundGenerator.isPlaying(type)) {
        soundGenerator.stop(type);
        row.classList.remove('is-playing');
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
      } else if (val > 0 && !soundGenerator.isPlaying(type)) {
        if (type === 'rain') soundGenerator.startRain(val);
        if (type === 'binaural') soundGenerator.startBinaural(val);
        if (type === 'stream') soundGenerator.startStream(val);
        row.classList.add('is-playing');
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
      } else {
        soundGenerator.setVolume(type, val);
      }
      updateBadge();
    });
  });

  if (stopAllBtn) {
    stopAllBtn.addEventListener('click', () => {
      soundGenerator.stopAll();
      sounds.forEach(type => {
        const row = document.querySelector(`.sound-row[data-sound="${type}"]`);
        const btn = document.getElementById(`btn-sound-${type}`);
        const slider = document.getElementById(`volume-${type}`);
        if (row) row.classList.remove('is-playing');
        if (btn) btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
        if (slider) slider.value = '0';
      });
      updateBadge();
      showToast('All audio muted');
    });
  }
}

// ===================================================================
// 5. Pomodoro Focus Timer
// ===================================================================
function setupPomodoroTimer() {
  const TIMER_MODES = {
    focus: { duration: 25 * 60, label: 'Deep Work' },
    shortBreak: { duration: 5 * 60, label: 'Short Rest' },
    longBreak: { duration: 15 * 60, label: 'Long Rest' }
  };

  let currentMode = 'focus';
  let timeLeft = TIMER_MODES[currentMode].duration;
  let timerInterval = null;
  let isRunning = false;
  let completedSessions = parseInt(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '0', 10);

  const readout = document.getElementById('timer-readout');
  const modeLabel = document.getElementById('timer-mode-label');
  const toggleBtn = document.getElementById('timer-toggle-btn');
  const toggleLabel = document.getElementById('timer-toggle-label');
  const resetBtn = document.getElementById('timer-reset-btn');
  const progressRing = document.getElementById('timer-progress-ring');
  const modeTabs = document.querySelectorAll('.mode-tab');
  const sessionBadge = document.getElementById('session-count-badge');

  const circumference = 2 * Math.PI * 95; // radius = 95 => ~596.9

  function updateSessionBadge() {
    if (sessionBadge) {
      sessionBadge.textContent = `Session #${completedSessions + 1}`;
    }
  }

  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    if (readout) {
      readout.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    if (modeLabel) {
      modeLabel.textContent = TIMER_MODES[currentMode].label;
    }

    // Circular progress
    if (progressRing) {
      const total = TIMER_MODES[currentMode].duration;
      const progressRatio = timeLeft / total;
      const offset = circumference * (1 - progressRatio);
      progressRing.style.strokeDashoffset = offset;
    }
  }

  function setMode(modeKey) {
    if (!TIMER_MODES[modeKey]) return;
    pauseTimer();
    currentMode = modeKey;
    timeLeft = TIMER_MODES[currentMode].duration;
    modeTabs.forEach(t => {
      const isActive = t.dataset.mode === modeKey;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    updateDisplay();
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    if (toggleLabel) toggleLabel.textContent = 'Pause';
    if (toggleBtn) {
      toggleBtn.querySelector('svg').outerHTML = `
        <svg class="pause-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
        </svg>
      `;
    }

    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        handleTimerComplete();
      }
    }, 1000);
  }

  function pauseTimer() {
    isRunning = false;
    if (timerInterval) clearInterval(timerInterval);
    if (toggleLabel) toggleLabel.textContent = 'Start Focus';
    if (toggleBtn) {
      toggleBtn.querySelector('svg').outerHTML = `
        <svg class="play-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
      `;
    }
  }

  function handleTimerComplete() {
    pauseTimer();
    playChimeSound();

    if (currentMode === 'focus') {
      completedSessions++;
      localStorage.setItem(STORAGE_KEYS.SESSIONS, completedSessions);
      updateSessionBadge();
      showToast('🎉 Focus session completed! Time for a well-deserved rest.');
      setMode('shortBreak');
    } else {
      showToast('⚡ Break finished! Ready to get back into flow?');
      setMode('focus');
    }
  }

  function resetTimer() {
    pauseTimer();
    timeLeft = TIMER_MODES[currentMode].duration;
    updateDisplay();
    showToast('Timer reset');
  }

  // Event Listeners
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (isRunning) pauseTimer();
      else startTimer();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetTimer);
  }

  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      setMode(tab.dataset.mode);
    });
  });

  // Chime toggle persistence
  const chimeToggle = document.getElementById('chime-toggle');
  if (chimeToggle) {
    const savedChime = localStorage.getItem(STORAGE_KEYS.CHIME);
    if (savedChime !== null) {
      chimeToggle.checked = savedChime === 'true';
    }
    chimeToggle.addEventListener('change', () => {
      localStorage.setItem(STORAGE_KEYS.CHIME, chimeToggle.checked);
    });
  }

  updateSessionBadge();
  updateDisplay();
}

// ===================================================================
// 6. Action Items & Task Manager
// ===================================================================
function setupTaskManager() {
  const form = document.getElementById('add-task-form');
  const input = document.getElementById('task-input-field');
  const prioritySelect = document.getElementById('task-priority-select');
  const taskList = document.getElementById('task-list-container');
  const emptyState = document.getElementById('task-empty-state');
  const filterChips = document.querySelectorAll('.filter-chip');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');
  const statsPill = document.getElementById('task-completion-stats');

  const countAll = document.getElementById('count-all');
  const countActive = document.getElementById('count-active');
  const countCompleted = document.getElementById('count-completed');

  let currentFilter = 'all';

  // Load Tasks
  let tasks = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (stored) tasks = JSON.parse(stored);
  } catch (e) {
    tasks = [];
  }

  // Default tasks if empty on first load
  if (!tasks || tasks.length === 0) {
    tasks = [
      { id: '1', text: 'Outline the core objectives for today', priority: 'high', completed: true },
      { id: '2', text: 'Complete 2 deep-focus work blocks', priority: 'medium', completed: false },
      { id: '3', text: 'Organize design notes & clean workspace', priority: 'low', completed: false }
    ];
    saveTasks();
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    renderTasks();
  }

  function renderTasks() {
    if (!taskList) return;
    taskList.innerHTML = '';

    const total = tasks.length;
    const completedCount = tasks.filter(t => t.completed).length;
    const activeCount = total - completedCount;

    if (countAll) countAll.textContent = total;
    if (countActive) countActive.textContent = activeCount;
    if (countCompleted) countCompleted.textContent = completedCount;
    if (statsPill) statsPill.textContent = `${completedCount}/${total} done`;

    const filtered = tasks.filter(task => {
      if (currentFilter === 'active') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true;
    });

    if (filtered.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
    } else {
      if (emptyState) emptyState.classList.add('hidden');
    }

    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.dataset.id = task.id;

      li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task done">
        <div class="task-content">
          <span class="task-text">${escapeHtml(task.text)}</span>
          <span class="task-priority-tag priority-${task.priority}">${task.priority}</span>
        </div>
        <button type="button" class="task-delete-btn" title="Delete item" aria-label="Delete Task">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      `;

      // Checkbox event
      const chk = li.querySelector('.task-checkbox');
      chk.addEventListener('change', () => {
        task.completed = chk.checked;
        saveTasks();
        if (task.completed) showToast('✨ Milestone accomplished!');
      });

      // Delete event
      const del = li.querySelector('.task-delete-btn');
      del.addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        showToast('Task removed');
      });

      taskList.appendChild(li);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      const newTask = {
        id: Date.now().toString(),
        text,
        priority: prioritySelect.value,
        completed: false
      };

      tasks.unshift(newTask);
      saveTasks();
      input.value = '';
      showToast('Task added to flow');
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      renderTasks();
    });
  });

  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', () => {
      const beforeCount = tasks.length;
      tasks = tasks.filter(t => !t.completed);
      if (tasks.length < beforeCount) {
        saveTasks();
        showToast('Completed items cleared');
      }
    });
  }

  renderTasks();
}

// ===================================================================
// 7. Instant Scratchpad & Notes
// ===================================================================
function setupScratchpad() {
  const textarea = document.getElementById('scratchpad-textarea');
  const wordCountElem = document.getElementById('note-words');
  const charCountElem = document.getElementById('note-chars');
  const saveStatus = document.getElementById('note-save-status');
  const copyBtn = document.getElementById('copy-notes-btn');
  const clearBtn = document.getElementById('clear-notes-btn');

  if (!textarea) return;

  // Restore saved notes
  const savedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
  if (savedNotes !== null) {
    textarea.value = savedNotes;
  }

  function updateCounts() {
    const val = textarea.value;
    const chars = val.length;
    const words = val.trim() ? val.trim().split(/\s+/).length : 0;
    if (charCountElem) charCountElem.textContent = `${chars} chars`;
    if (wordCountElem) wordCountElem.textContent = `${words} words`;
  }

  let saveTimer = null;
  textarea.addEventListener('input', () => {
    updateCounts();
    if (saveStatus) {
      saveStatus.textContent = 'Saving...';
      saveStatus.style.opacity = '1';
    }

    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEYS.NOTES, textarea.value);
      if (saveStatus) {
        saveStatus.textContent = 'Saved';
      }
    }, 450);
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (!textarea.value.trim()) {
        showToast('Scratchpad is empty');
        return;
      }
      navigator.clipboard.writeText(textarea.value).then(() => {
        showToast('Notes copied to clipboard!');
      }).catch(() => {
        textarea.select();
        document.execCommand('copy');
        showToast('Notes copied to clipboard!');
      });
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (!textarea.value.trim()) return;
      if (window.confirm('Clear all notes in the scratchpad?')) {
        textarea.value = '';
        localStorage.setItem(STORAGE_KEYS.NOTES, '');
        updateCounts();
        showToast('Notes cleared');
      }
    });
  }

  updateCounts();
}

// ===================================================================
// Initialization
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
  updateClockAndGreeting();
  setInterval(updateClockAndGreeting, 1000);

  setupQuotes();
  setupThemeSwitcher();
  setupPomodoroTimer();
  setupTaskManager();
  setupAmbientSounds();
  setupScratchpad();
});
