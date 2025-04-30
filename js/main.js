import { Game } from "./Game.js";
import { Menu } from "./ui/Menu.js";
import { Shop } from "./ui/Shop.js";
import { AudioManager } from './ui/Audio.js';

document.addEventListener("DOMContentLoaded", () => {
  const audio = new AudioManager();
  const game = new Game();
  const menu = new Menu(game);
  const shop = new Shop();
  menu.showMainMenu();
  // game.init();
  if (!localStorage.getItem('gameCoins')) {
    localStorage.setItem('gameCoins', '500'); // Стартовый баланс
  }
  document
    .getElementById("new-game")
    .addEventListener("click", () => game.init());
  document
    .getElementById("hint")
    .addEventListener("click", () => game.showHint());
});
