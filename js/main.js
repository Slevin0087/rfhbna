import { Game } from "./Game.js";
import { Menu } from "./ui/Menu.js";
import { UseName } from "./ui/UseName.js";
import { Shop } from "./ui/Shop.js";
import { AudioManager } from './ui/Audio.js';

document.addEventListener("DOMContentLoaded", () => {
  let nameValue = '';
  const audio = new AudioManager();
  const game = new Game();
  const name = new UseName();
  const menu = new Menu(game);
  const shop = new Shop();
  // name.showUseName();
  menu.hideAll();
  
  // game.init();
  if (!localStorage.getItem('gameCoins')) {
    localStorage.setItem('gameCoins', '500'); // Стартовый баланс
  }
  document.getElementById("start-game").addEventListener("click", () => {
    nameValue = document.getElementById("player-name").value;
    name.modal.style.display = "none";
    console.log("nameValue:", nameValue);
    // document.getElementById('message').textContent = 'Игра началась, ' + nameValue + '!';
    game.originalText = 'Игра началась, ' + nameValue + '!';
    menu.showMainMenu();
  });
  document.getElementById("skip-name").addEventListener("click", () => {
    nameValue = "";
    name.modal.style.display = "none";
    game.originalText = 'Игра началась!';
    menu.showMainMenu();
  });
  document
  .getElementById("new-game")
  .addEventListener("click", () => game.init());
  document
  .getElementById("hint")
  .addEventListener("click", () => game.showHint());
});
