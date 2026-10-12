// Dedicated Audio Engine for Stranger Things Event
// Volume: 15% (0.15)
// Continuous Loop: Plays from start to end, then repeats in an infinite loop when ON.
// Scroll-Independent: Scrolling or not scrolling has zero effect on the audio loop.

class SoundEngine {
  constructor() {
    this.audioSrc = '/assets/demogorgon-roar.mp3';
    this.audioInstance = null;
    this.isMuted = false; // ON by default
    this.hasUnlocked = false;
    this.targetVolume = 0.15; // 15% volume as requested

    if (typeof window !== 'undefined') {
      this.getAudio();

      // Try starting immediately if browser permits
      this.startLoop(true);

      // Unlock on first user interaction if browser blocked initial autoplay
      const unlockAudio = () => {
        if (!this.hasUnlocked) {
          this.hasUnlocked = true;
          if (!this.isMuted) {
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
    }
  }

  getAudio() {
    if (!this.audioInstance && typeof window !== 'undefined') {
      this.audioInstance = new Audio(this.audioSrc);
      this.audioInstance.volume = this.targetVolume; // 35% Volume
      this.audioInstance.loop = true; // Continuous start-to-end loop
      this.audioInstance.preload = 'auto';

      // Explicit fallback listener to guarantee seamless start-to-end loop repetition
      this.audioInstance.addEventListener('ended', () => {
        if (!this.isMuted && this.audioInstance) {
          this.audioInstance.currentTime = 0;
          this.audioInstance.play().catch(() => {});
        }
      });
    }
    return this.audioInstance;
  }

  // Starts the continuous start-to-end loop
  startLoop(resetToStart = false) {
    if (this.isMuted) return;

    try {
      const audio = this.getAudio();
      if (!audio) return;

      audio.volume = this.targetVolume; // 35%
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

  // Ensures the continuous loop is playing at 35% without interrupting it if already playing
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
        audio.volume = this.targetVolume; // 35%
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

