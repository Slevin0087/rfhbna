import { Game } from "./js/Game.js";
import { Menu } from "./js/ui/Menu.js";
import { UseName } from "./js/ui/UseName.js";
import { Shop } from "./js/ui/Shop.js";
import { AudioManager } from "./js/ui/Audio.js";

document.addEventListener("DOMContentLoaded", () => {
  let nameValue = "";
  const audio = new AudioManager();
  const game = new Game();
  const name = new UseName();
  const menu = new Menu(game);
  const shop = new Shop();
  // name.showUseName();

  function toggleFullscreen() {
    console.log("заход в функцию, полный экран");
    const fullScreenBtn = document.getElementById("full-screen-btn");

    if (!document.fullscreenElement) {
      // Запуск полноэкранного режима
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Ошибка при переходе в полноэкранный режим: ${err}`);
      });
      if (fullScreenBtn.textContent === "+") fullScreenBtn.textContent = "-";
    } else {
      // Выход из полноэкранного режима
      if (document.exitFullscreen) {
        document.exitFullscreen();
        if (fullScreenBtn.textContent === "-") fullScreenBtn.textContent = "+";
      }
    }
  }

  name.hideAll();

  // game.init();
  if (!localStorage.getItem("gameCoins")) {
    localStorage.setItem("gameCoins", "500"); // Стартовый баланс
  }

  const form = document.getElementById("player-modal");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    nameValue = document.getElementById("player-name").value || "Игрок";
    name.modal.classList.add("hidden");
    game.originalText = `Игра началась, ${nameValue}!`;
    menu.showMainMenu();
    // localStorage.setItem('playerName', name);
    // closeModal();
  });

  // Обработка "Пропустить"
  document.getElementById("skip-name").addEventListener("click", () => {
    name.modal.classList.add("hidden");
    game.originalText = "Игра началась!";
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
    .getElementById("full-screen-btn")
    .addEventListener("click", () => toggleFullscreen());

  document
    .getElementById("new-game")
    .addEventListener("click", () => game.init());

  document
    .getElementById("hint")
    .addEventListener("click", () => game.showHint());

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("sw.js")
        .then(() => console.log("SW зарегистрирован"))
        .catch((err) => console.error("Ошибка SW:", err));
    });
  }
});
