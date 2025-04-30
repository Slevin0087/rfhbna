export class GameStorage {
  static getSettings() {
    return (
      JSON.parse(localStorage.getItem("gameSettings")) || {
        sound: true,
        difficulty: "normal",
        cardSkin: "default",
      }
    );
  }

  static saveSettings(settings) {
    localStorage.setItem("gameSettings", JSON.stringify(settings));
  }

  static getCoins() {
    return parseInt(localStorage.getItem("gameCoins")) || 0;
  }

  static addCoins(amount) {
    const current = this.getCoins();
    localStorage.setItem("gameCoins", current + amount);
  }
}
