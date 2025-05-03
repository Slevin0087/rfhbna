

export class UseName {
  constructor() {
    this.modal = document.getElementById("player-modal");
    this.value = "";
    this.menu = document.getElementById("game-menu");
    this.initEventListeners();
  }
  initEventListeners() {
    document.getElementById("start-game").addEventListener("click", () => {
      this.value = document.getElementById("player-name").value;
      this.modal.style.display = "none";
      console.log("this.value:", this.value);
    });
    document.getElementById("skip-name").addEventListener("click", () => {
      this.value = "";
      this.modal.style.display = "none";
    });
  }

//   showUseName() {
//     this.hideAll();
//   }

//   hideAll() {
//     this.menu.classList.add("hidden");
//     this.settings.classList.add("hidden");
//     this.shop.classList.add("hidden");
//     this.gameInterface.classList.add("hidden");
//   }


}
