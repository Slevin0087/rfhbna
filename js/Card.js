export class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
    this.color = suit === "♥" || suit === "♦" ? "red" : "black";
    this.faceUp = false;
    this.foundation = false;
    this.column = null;
    this.position = null;
    this.containerRectLeft = null;
    this.containerRectTop = null;
    this.containerRectWidth = null;
    this.containerRectHeight = null;
    this.parentElement = null;
    this.wasteCard = false;
  }

  getSymbol() {
    return this.faceUp ? `${this.value}${this.suit}` : "";
  }

  flip() {
    this.faceUp = !this.faceUp;
  }
}
