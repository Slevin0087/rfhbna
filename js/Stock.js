export class Stock {
  constructor() {
    this.cards = [];
    this.index = 0;
    this.element = this.createStockElement();
    this.wasteElement = this.createWasteElement();
  }

  createStockElement() {
    const element = document.createElement("div");
    element.className = "stock";
    element.id = "stock";
    // element.style.left = "20px";
    // element.style.top = "20px";
    return element;
  }

  createWasteElement() {
    const element = document.createElement("div");
    element.className = "card-placeholder";
    element.id = "waste";
    // element.style.left = "110px";
    // element.style.top = "20px";
    return element;
  }

  addCards(cards) {
    this.cards = cards;
    this.index = 0;
  }

  deal() {
    if (this.index >= this.cards.length) {
      this.index = 0;
      return null;
    }

    const card = this.cards[this.index];
    card.faceUp = true;
    this.index++;
    return card;
  }

  getCurrentCard() {
    if (this.index > 0) {
      return this.cards[this.index - 1];
    }
    return null;
  }
}
