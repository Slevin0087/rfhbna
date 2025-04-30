import { GameStorage } from "../utils/Storage.js";
import { AudioManager } from "./Audio.js";

export class Settings {
  constructor(audio) {
    this.audio = audio;
    this.settingsElement = document.getElementById("settings");
    this.initEventListeners();
    this.loadSettings();
  }

  initEventListeners() {
    document.getElementById("sound-toggle").addEventListener("change", (e) => {
      this.audio.toggle(e.target.checked);
      this.saveSettings();
    });

    document.getElementById("difficulty").addEventListener("change", () => {
      this.saveSettings();
    });
  }

  loadSettings() {
    const settings = GameStorage.getSettings();
    document.getElementById("sound-toggle").checked = settings.sound;
    document.getElementById("difficulty").value = settings.difficulty;
  }

  saveSettings() {
    const settings = {
      sound: document.getElementById("sound-toggle").checked,
      difficulty: document.getElementById("difficulty").value,
    };
    GameStorage.saveSettings(settings);
  }

  show() {
    this.settingsElement.classList.remove("hidden");
  }

  hide() {
    this.settingsElement.classList.add("hidden");
  }
}
