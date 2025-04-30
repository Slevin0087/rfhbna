// export class AudioManager {
//   constructor() {
//     this.sounds = {
//       click: new Audio("assets/sounds/click.mp3"),
//       cardFlip: new Audio("assets/sounds/card-flip.mp3"),
//       win: new Audio("assets/sounds/win.mp3"),
//       info: new Audio("assets/sounds/info.mp3"),
//     };
//     this.enabled = true;
//   }

//   play(soundName) {
//     if (this.enabled && this.sounds[soundName]) {
//       this.sounds[soundName].currentTime = 0;
//       this.sounds[soundName].play();
//     }
//   }

//   toggle(enabled) {
//     this.enabled = enabled;
//   }
// }

export class AudioManager {
  constructor() {
    // Звуковые эффекты
    this.sounds = {
      click: this.createSound("assets/sounds/click.mp3"),
      cardFlip: this.createSound("assets/sounds/card-flip.mp3"),
      // cardMove: this.createSound('assets/sounds/card-move.mp3'),
      info: this.createSound("assets/sounds/info.mp3"),
      win: this.createSound("assets/sounds/win.mp3"),
    };

    // Фоновая музыка
    this.backgroundMusic = this.createSound('assets/sounds/background.mp3', true);
    this.backgroundMusic.volume = 0.3;

    this.enabled = true;
  }

  // Создаёт аудиоэлемент
  createSound(src, loop = false) {
    const audio = new Audio(src);
    audio.loop = loop;
    return audio;
  }

  // Воспроизведение звука
  play(soundName) {
    if (!this.enabled || !this.sounds[soundName]) return;

    try {
      this.sounds[soundName].currentTime = 0;
      this.sounds[soundName].play();
    } catch (e) {
      console.error("Ошибка воспроизведения звука:", e);
    }
  }

  // Управление фоновой музыкой
  playMusic() {
    if (this.enabled) this.backgroundMusic.play();
  }

  stopMusic() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
  }

  // Включение/выключение звука
  toggle(enabled) {
    this.enabled = enabled;
    if (!enabled) this.stopMusic();
  }
}
