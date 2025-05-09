export class Foundation {
  constructor(index) {
    this.index = index;
    this.cards = [];
    this.element = this.createFoundationElement();
  }

  createFoundationElement() {
    const element = document.createElement("div");
    element.className = "foundation";
    element.id = `foundation-${this.index}`;

    // element.style.left = 290 + this.index * 90 + "px";
    // element.style.top = "20px";
    return element;
  }

  // canAccept(card) проверяет карту, можно ли её класть на foundation. возвращает true или false. если foundation пустой, то возвращает true, если карта это туз "A",
  // если не пустой foundation, то возвращает true, если карта той же масти, что и находящейся уже там карты и если по иерархии больше той, что уже лежит
  canAccept(card) {
    if (card.foundation) return !card.foundation;
    else if (card.parent === 'tableau' && card.parentElement.childNodes.length > card.position + 1) return false;
    else if (this.cards.length === 0) return card.value === "A";
    else {
        const topCard = this.cards[this.cards.length - 1];
        return (
          card.suit === topCard.suit &&
          this.getValueIndex(card.value) ===
            this.getValueIndex(topCard.value) + 1
        );
      }
  }

  addCard(card) {
    card.indexFoundation = this.index;
    card.foundation = true;
    card.parent = "foundation";
    this.cards.push(card);
  }

  removeCard() {
    return this.cards.pop();
  }

  getValueIndex(value) {
    const values = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];
    return values.indexOf(value);
  }

  isComplete() {
    return this.cards.length === 13;
  }
}
