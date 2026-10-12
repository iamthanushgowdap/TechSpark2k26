// Dedicated Audio Engine for Stranger Things Event
// Volume: 4% (0.04)
// Continuous Loop: Plays from start to end, then repeats in an infinite loop when ON.
// Scroll-Independent: Scrolling or not scrolling has zero effect on the audio loop.

class SoundEngine {
  constructor() {
    this.audioSrc = '/assets/demogorgon-roar.mp3';
    this.audioInstance = null;
    this.isMuted = false; // ON by default
    this.hasUnlocked = false;
    this.targetVolume = 0.04; // 4% volume as requested

    if (typeof window !== 'undefined') {
      const audio = this.getAudio();
      if (audio) {
        audio.volume = this.targetVolume;
      }

      // Try starting immediately if browser permits
      this.startLoop(false);

      // Unlock on first user interaction if browser blocked initial autoplay
      const unlockAudio = () => {
        if (!this.hasUnlocked) {
          this.hasUnlocked = true;
          if (!this.isMuted && !document.hidden) {
            this.startLoop(false);
          }
          ['click', 'touchstart', 'pointerdown', 'keydown'].forEach((evt) => {
            window.removeEventListener(evt, unlockAudio, true);
          });
        }
      };

      ['click', 'touchstart', 'pointerdown', 'keydown'].forEach((evt) => {
        window.addEventListener(evt, unlockAudio, { capture: true, once: true });
      });

      // Automatically pause audio when user switches tabs, minimizes browser, or switches apps
      const pauseForBackground = () => {
        const currentAudio = this.getAudio();
        if (currentAudio && !currentAudio.paused) {
          currentAudio.pause();
        }
      };

      const resumeForForeground = () => {
        if (!this.isMuted && !document.hidden && document.hasFocus()) {
          this.startLoop(false);
        }
      };

      document.addEventListener('visibilitychange', () => {
        if (document.hidden || document.visibilityState !== 'visible') {
          pauseForBackground();
        } else {
          resumeForForeground();
        }
      });

      window.addEventListener('blur', pauseForBackground);
      window.addEventListener('focus', resumeForForeground);
      window.addEventListener('pagehide', pauseForBackground);
      window.addEventListener('beforeunload', pauseForBackground);
    }
  }

  getAudio() {
    if (typeof window === 'undefined') return null;

    // Reuse global singleton across HMR reloads so old audio never stays loud
    if (window.__techsparkAudio) {
      this.audioInstance = window.__techsparkAudio;
      this.audioInstance.volume = this.targetVolume; // Strictly 4% (0.04)
      this.audioInstance.loop = true;
      return this.audioInstance;
    }

    if (!this.audioInstance) {
      this.audioInstance = new Audio(this.audioSrc);
      this.audioInstance.volume = this.targetVolume; // 4% Volume (0.04)
      this.audioInstance.loop = true; // Continuous start-to-end loop
      this.audioInstance.preload = 'auto';

      // Enforce 4% volume on play/timeupdate
      this.audioInstance.addEventListener('play', () => {
        if (this.audioInstance) {
          this.audioInstance.volume = this.targetVolume;
        }
      });

      // Explicit fallback listener to guarantee seamless start-to-end loop repetition
      this.audioInstance.addEventListener('ended', () => {
        if (!this.isMuted && !document.hidden && this.audioInstance) {
          this.audioInstance.volume = this.targetVolume;
          this.audioInstance.currentTime = 0;
          this.audioInstance.play().catch(() => {});
        }
      });

      window.__techsparkAudio = this.audioInstance;
    }
    return this.audioInstance;
  }

  // Starts the continuous start-to-end loop only when user is actively on the page
  startLoop(resetToStart = false) {
    if (this.isMuted) return;
    if (typeof document !== 'undefined' && document.hidden) return;

    try {
      const audio = this.getAudio();
      if (!audio) return;

      audio.volume = this.targetVolume; // 4% (0.04)
      audio.loop = true;

      if (resetToStart) {
        audio.currentTime = 0;
      }

      if (audio.paused) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Browser waiting for first user interaction
          });
        }
      }
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // Ensures the continuous loop is playing at 4% without interrupting it if already playing
  playDemogorgonRoar() {
    if (this.isMuted) return;
    this.startLoop(false);
  }

  // Header Toggle button: OFF stops sound; ON starts from start to end and loops
  toggleAudio() {
    const audio = this.getAudio();

    if (this.isMuted) {
      // Turn ON: Start from the beginning (0) to end and loop continuously
      this.isMuted = false;
      if (audio) {
        audio.volume = this.targetVolume; // 4% (0.04)
        audio.loop = true;
        audio.currentTime = 0;
        audio.play().catch((err) => {
          console.warn('Audio play error on toggle ON:', err);
        });
      }
      return true; // isPlaying = true
    } else {
      // Turn OFF: Immediately stop sound
      this.isMuted = true;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      return false; // isPlaying = false
    }
  }

  // Stubs so no scroll or UI events ever interfere with the main audio loop
  playThunder() {}
  playLightningCrack() {}
  playPortalGlitch() {}
  playClockChime() {}
}

export const soundEngine = new SoundEngine();

