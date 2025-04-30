import { Settings } from './Settings.js';
import { AudioManager } from './Audio.js';

export class Menu {
  constructor(game) {
    this.game = game;
    this.menu = document.getElementById("game-menu");
    this.settings = document.getElementById("settings");
    this.shop = document.getElementById("shop");
    this.gameInterface = document.getElementById("game-interface");

    this.initEventListeners();
  }

  initEventListeners() {
    document.getElementById("new-game-btn").addEventListener("click", () => {
      this.hideAll();
      this.gameInterface.classList.remove("hidden");
      this.game.init();
    });

    document.getElementById("settings-btn").addEventListener("click", () => {
      this.showSettings();
    });

    document.getElementById("shop-btn").addEventListener("click", () => {
      this.showShop();
    });

    document.getElementById("menu-btn").addEventListener("click", () => {
      this.showMainMenu();
    });

    document.getElementById("back-to-menu").addEventListener("click", () => {
      this.showMainMenu();
    });

    document.getElementById("shop-back").addEventListener("click", () => {
      this.showMainMenu();
    });
  }

  showMainMenu() {
    this.hideAll();
    this.menu.classList.remove("hidden");
  }

  showSettings() {
    this.hideAll();
    this.settings.classList.remove("hidden");
    this.loadSettings();
  }

  showShop() {
    this.hideAll();
    this.shop.classList.remove("hidden");
    this.updateBalance();
  }

  hideAll() {
    this.menu.classList.add("hidden");
    this.settings.classList.add("hidden");
    this.shop.classList.add("hidden");
    this.gameInterface.classList.add("hidden");
  }

  loadSettings() {
    const settings = JSON.parse(localStorage.getItem("gameSettings")) || {};
    document.getElementById("sound-toggle").checked = settings.sound !== false;
    document.getElementById("difficulty").value =
      settings.difficulty || "normal";
  }

  saveSettings() {
    const settings = {
      sound: document.getElementById("sound-toggle").checked,
      difficulty: document.getElementById("difficulty").value,
    };
    localStorage.setItem("gameSettings", JSON.stringify(settings));
  }

  updateBalance() {
    const coins = localStorage.getItem("gameCoins") || 0;
    document.getElementById("coins").textContent = coins;
  }
}
