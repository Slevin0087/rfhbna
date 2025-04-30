export class AudioManager {
  constructor() {
    // this.sounds = {
    //   click: new Audio("assets/sounds/click.mp3"),
    //   cardFlip: new Audio("assets/sounds/card-flip.mp3"),
    //   win: new Audio("assets/sounds/win.mp3"),
    // };
    this.enabled = true;
  }

  play(soundName) {
    if (this.enabled && this.sounds[soundName]) {
      this.sounds[soundName].currentTime = 0;
      this.sounds[soundName].play();
    }
  }

  toggle(enabled) {
    this.enabled = enabled;
  }
}
