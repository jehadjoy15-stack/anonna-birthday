// Hide Loader immediately & safely
function hideLoader() {
  try {
    var loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hide');
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      loader.style.pointerEvents = 'none';
      setTimeout(function() {
        if (loader && loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 700);
    }
    triggerConfetti(50);
  } catch(e) {
    console.error(e);
  }
}

// Ensure loader hides without blocking
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(hideLoader, 500);
} else {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(hideLoader, 600);
  });
  window.addEventListener('load', function() {
    setTimeout(hideLoader, 400);
  });
}
setTimeout(hideLoader, 1600);

// ==========================================
// 1. GLOBAL STATE & SECTIONS NAVIGATION
// ==========================================
var allSections = document.querySelectorAll('.page-section');
var dotsContainer = document.getElementById('navDots');
var currentSection = 0;

if (dotsContainer && allSections.length > 0) {
  allSections.forEach(function(sec, i) {
    var dot = document.createElement('button');
    dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', sec.dataset.section || ('Section ' + i));
    dot.innerHTML = '<span class= nav-label>' + (sec.dataset.section || '') + '</span>';
    dot.onclick = function() { goToSection(i); };
    dotsContainer.appendChild(dot);
  });
}

function goToSection(index) {
  if (index < 0 || index >= allSections.length) return;
  currentSection = index;
  allSections[index].scrollIntoView({ behavior: 'smooth' });
  updateActiveDot();
  updateProgress();
}

function updateActiveDot() {
  document.querySelectorAll('.nav-dot').forEach(function(d, i) {
    d.classList.toggle('active', i === currentSection);
  });
}

function updateProgress() {
  var bar = document.getElementById('progressBar');
  if (bar && allSections.length > 1) {
    var pct = (currentSection / (allSections.length - 1)) * 100;
    bar.style.width = pct + '%';
  }
}

// Intersection Observer for scroll triggers
if ('IntersectionObserver' in window) {
  var sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        var idx = Array.prototype.indexOf.call(allSections, e.target);
        if (idx !== -1) {
          currentSection = idx;
          updateActiveDot();
          updateProgress();
        }
      }
    });
  }, { threshold: 0.35 });

  allSections.forEach(function(s) { sectionObserver.observe(s); });
} else {
  allSections.forEach(function(s) { s.classList.add('visible'); });
}

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goToSection(currentSection + 1);
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goToSection(currentSection - 1);
});

// ==========================================
// 2. FALLING ROSE PETALS CANVAS ENGINE
// ==========================================
var canvas = document.getElementById('petalCanvas');
if (canvas) {
  var ctx = canvas.getContext('2d');
  var petals = [];
  var PETAL_COUNT = 28;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function Petal() {
    this.reset(true);
  }

  Petal.prototype.reset = function(initial) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : -20;
    this.size = Math.random() * 12 + 10;
    this.speedY = Math.random() * 1.5 + 0.8;
    this.speedX = Math.random() * 1.2 - 0.6;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 2;
    this.opacity = Math.random() * 0.4 + 0.5;
    this.color = Math.random() > 0.3 ? '#ff4d88' : '#ff758c';
    this.flip = Math.random() * Math.PI;
    this.flipSpeed = Math.random() * 0.03 + 0.01;
  };

  Petal.prototype.update = function() {
    this.y += this.speedY;
    this.x += Math.sin(this.y * 0.01) + this.speedX;
    this.rotation += this.rotSpeed;
    this.flip += this.flipSpeed;

    if (this.y > canvas.height + 20 || this.x < -30 || this.x > canvas.width + 30) {
      this.reset(false);
    }
  };

  Petal.prototype.draw = function() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.scale(Math.sin(this.flip), 1);
    ctx.globalAlpha = this.opacity;

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-this.size, -this.size * 0.8, -this.size * 0.5, this.size, 0, this.size * 1.2);
    ctx.bezierCurveTo(this.size * 0.5, this.size, this.size, -this.size * 0.8, 0, 0);
    ctx.fill();

    ctx.restore();
  };

  for (var i = 0; i < PETAL_COUNT; i++) {
    petals.push(new Petal());
  }

  function animatePetals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(function(p) {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animatePetals);
  }
  animatePetals();
}

// Floating Particles
(function createBackgroundParticles() {
  var container = document.getElementById('particles');
  if (!container) return;
  var colors = ['#ff4d88', '#ffd32a', '#a855f7', '#38bdf8', '#ff758c'];
  for (var i = 0; i < 24; i++) {
    var p = document.createElement('div');
    p.className = 'particle';
    var size = Math.random() * 4 + 2;
    p.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (Math.random() * 100) + '%;background:' + colors[Math.floor(Math.random() * colors.length)] + ';box-shadow:0 0 10px ' + colors[Math.floor(Math.random() * colors.length)] + ';animation-duration:' + (Math.random() * 9 + 7) + 's;animation-delay:' + (Math.random() * 5) + 's;';
    container.appendChild(p);
  }
})();

// ==========================================
// 3. INTERACTIVE LETTER LOGIC
// ==========================================
function openLetter() {
  var envelope = document.getElementById('envelopeBox');
  var letter = document.getElementById('parchmentLetter');
  
  playSparkleChime();
  startMusicPlay(); // Automatically starts romantic music when letter is opened!
  triggerConfetti(50);
  
  if (envelope) {
    envelope.style.opacity = '0';
    envelope.style.transform = 'scale(0.8)';
    setTimeout(function() {
      envelope.style.display = 'none';
      if (letter) letter.classList.add('active');
    }, 300);
  }
}

function toggleLetterMode() {
  var envelope = document.getElementById('envelopeBox');
  var letter = document.getElementById('parchmentLetter');
  
  if (letter) letter.classList.remove('active');
  setTimeout(function() {
    if (envelope) {
      envelope.style.display = 'flex';
      envelope.style.opacity = '1';
      envelope.style.transform = 'translateY(0) scale(1)';
    }
  }, 200);
}

// ==========================================
// 4. CAKE & CANDLE BLOWING INTERACTION
// ==========================================
function blowCandles() {
  var cake = document.getElementById('cakeWrapper');
  var banner = document.getElementById('wishBanner');
  var blowBtn = document.getElementById('blowBtn');
  var relightBtn = document.getElementById('relightBtn');

  if (cake) cake.classList.add('blown');
  blowSound();
  playSuccessFanfare();
  triggerConfetti(120);

  if (blowBtn) blowBtn.style.display = 'none';
  if (relightBtn) relightBtn.style.display = 'inline-flex';
  if (banner) banner.classList.add('show');
}

function relightCandles() {
  var cake = document.getElementById('cakeWrapper');
  var banner = document.getElementById('wishBanner');
  var blowBtn = document.getElementById('blowBtn');
  var relightBtn = document.getElementById('relightBtn');

  if (cake) cake.classList.remove('blown');
  if (banner) banner.classList.remove('show');
  if (blowBtn) blowBtn.style.display = 'inline-flex';
  if (relightBtn) relightBtn.style.display = 'none';
  playSparkleChime();
}

// ==========================================
// 5. POLAROID LIGHTBOX
// ==========================================
function openLightbox(src, caption) {
  var lb = document.getElementById('lightbox');
  var img = document.getElementById('lightbox-img');
  var cap = document.getElementById('lightbox-caption');
  if (img) img.src = src;
  if (cap) cap.innerText = caption || 'Cherished Memory';
  if (lb) lb.classList.add('active');
}

function closeLightbox() {
  var lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('active');
}

// ==========================================
// 6. CONFETTI EFFECT
// ==========================================
function triggerConfetti(count) {
  count = count || 60;
  var colors = ['#ff4d88', '#ffd32a', '#a855f7', '#38bdf8', '#ff758c', '#ffffff', '#ff2d60'];
  var emojis = ['💖', '✨', '🌸', '🎉', '👑'];

  for (var i = 0; i < count; i++) {
    var el = document.createElement('div');
    el.className = 'confetti-piece';
    var isEmoji = Math.random() < 0.2;

    if (isEmoji) {
      el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.fontSize = (Math.random() * 14 + 14) + 'px';
    } else {
      var size = Math.random() * 9 + 6;
      var isCircle = Math.random() > 0.5;
      el.style.width = size + 'px';
      el.style.height = isCircle ? size + 'px' : (size * 2.2) + 'px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.borderRadius = isCircle ? '50%' : '3px';
    }

    el.style.left = (Math.random() * 100) + 'vw';
    el.style.top = '-20px';
    el.style.animationDuration = (Math.random() * 2.5 + 2.2) + 's';
    el.style.animationDelay = (Math.random() * 0.6) + 's';

    document.body.appendChild(el);
    (function(element) {
      setTimeout(function() { element.remove(); }, 4500);
    })(el);
  }
}

// ==========================================
// 7. WEB AUDIO & MUSIC CONTROLS
// ==========================================
var musicBtn = document.getElementById('musicBtn');
var bgMusic = document.getElementById('bgMusic');
var isAudioPlaying = false;
var audioCtx = null;
var synthTimer = null;

function getAudioContext() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch(e) {
    return null;
  }
}

function playSparkleChime() {
  try {
    var ctx = getAudioContext();
    if (!ctx) return;
    var notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach(function(freq, idx) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.65);
    });
  } catch (e) {}
}

function blowSound() {
  try {
    var ctx = getAudioContext();
    if (!ctx) return;
    var bufferSize = ctx.sampleRate * 0.5;
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    var noise = ctx.createBufferSource();
    noise.buffer = buffer;
    var filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.5);

    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch (e) {}
}

function playSuccessFanfare() {
  try {
    var ctx = getAudioContext();
    if (!ctx) return;
    var melody = [523.25, 659.25, 783.99, 1046.50];
    melody.forEach(function(f, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.85);
    });
  } catch (e) {}
}

function startSynthMelody() {
  var notes = [
    261.63, 261.63, 293.66, 261.63, 349.23, 329.63,
    261.63, 261.63, 293.66, 261.63, 392.00, 349.23,
    261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66,
    466.16, 466.16, 440.00, 349.23, 392.00, 349.23
  ];
  var noteIndex = 0;
  
  synthTimer = setInterval(function() {
    if (!isAudioPlaying) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = notes[noteIndex];
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
      noteIndex = (noteIndex + 1) % notes.length;
    } catch(e) {}
  }, 480);
}

function stopSynthMelody() {
  clearInterval(synthTimer);
}

function startMusicPlay() {
  try {
    getAudioContext();
    if (!isAudioPlaying) {
      if (bgMusic) {
        bgMusic.volume = 0.45;
        if (bgMusic.play) {
          var playPromise = bgMusic.play();
          if (playPromise !== undefined) {
            playPromise
              .then(function() {
                if (musicBtn) musicBtn.classList.add('playing');
                isAudioPlaying = true;
              })
              .catch(function() {
                startSynthMelody();
                if (musicBtn) musicBtn.classList.add('playing');
                isAudioPlaying = true;
              });
          } else {
            startSynthMelody();
            if (musicBtn) musicBtn.classList.add('playing');
            isAudioPlaying = true;
          }
        } else {
          startSynthMelody();
          if (musicBtn) musicBtn.classList.add('playing');
          isAudioPlaying = true;
        }
      } else {
        startSynthMelody();
        if (musicBtn) musicBtn.classList.add('playing');
        isAudioPlaying = true;
      }
    }
  } catch(e) {
    console.error(e);
  }
}

function stopMusicPlay() {
  try {
    if (bgMusic) bgMusic.pause();
    stopSynthMelody();
    if (musicBtn) musicBtn.classList.remove('playing');
    isAudioPlaying = false;
  } catch(e) {}
}

if (musicBtn) {
  musicBtn.addEventListener('click', function() {
    if (isAudioPlaying) {
      stopMusicPlay();
    } else {
      startMusicPlay();
    }
  });
}

// Initialize Lucide Icons
window.addEventListener('DOMContentLoaded', function() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});