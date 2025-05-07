import { Game } from "./js/Game.js";
import { Menu } from "./js/ui/Menu.js";
import { UseName } from "./js/ui/UseName.js";
import { Shop } from "./js/ui/Shop.js";
import { AudioManager } from './js/ui/Audio.js';

document.addEventListener("DOMContentLoaded", () => {
  let nameValue = '';
  const audio = new AudioManager();
  const game = new Game();
  const name = new UseName();
  const menu = new Menu(game);
  const shop = new Shop();
  // name.showUseName();
  name.hideAll();
  
  // game.init();
  if (!localStorage.getItem('gameCoins')) {
    localStorage.setItem('gameCoins', '500'); // Стартовый баланс
  }

  const form = document.getElementById('player-modal');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    nameValue = document.getElementById('player-name').value || 'Игрок';
    name.modal.classList.add("hidden");
    game.originalText = `Игра началась, ${nameValue}'!`;
    menu.showMainMenu();
    // localStorage.setItem('playerName', name);
    // closeModal();
  });
  
  // Обработка "Пропустить"
  document.getElementById('skip-name').addEventListener('click', () => {
    name.modal.classList.add("hidden");
    game.originalText = 'Игра началась!';
    menu.showMainMenu();
    // localStorage.setItem('playerName', 'Игрок');
    // closeModal();
  });

  // document.getElementById("start-game").addEventListener("click", () => {
  //   nameValue = document.getElementById("player-name").value;
  //   name.modal.classList.add("hidden");
  //   console.log("nameValue:", nameValue);
  //   game.originalText = `Игра началась, ${nameValue}'!`;
  //   menu.showMainMenu();
  // });
  // document.getElementById("skip-name").addEventListener("click", () => {
  //   nameValue = "";
  //   name.modal.classList.add("hidden");
  //   game.originalText = 'Игра началась!';
  //   menu.showMainMenu();
  // });
  
  document
  .getElementById("new-game")
  .addEventListener("click", () => game.init());
  document
  .getElementById("hint")
  .addEventListener("click", () => game.showHint());
});
