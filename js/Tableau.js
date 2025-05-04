export class Tableau {
  constructor(index) {
    this.index = index;
    this.cards = [];
    this.element = this.createTableauElement();
  }

  createTableauElement() {
    const element = document.createElement("div");
    element.className = "card-placeholder";
    element.id = `tableau-${this.index}`;
    // element.style.left = 20 + this.index * 90 + "px";
    // element.style.top = "150px";
    // Рассчитываем позицию динамически
    // const cardWidth = parseFloat(
    //   getComputedStyle(document.documentElement).getPropertyValue(
    //     "--card-width"
    //   )
    // );
    // console.log('getComputedStyle(document.documentElement):', getComputedStyle(document.documentElement));

    // const spacing = parseFloat(
    //   getComputedStyle(document.documentElement).getPropertyValue(
    //     "--card-spacing"
    //   )
    // );

    // element.style.left = `${spacing + this.index * (cardWidth + spacing)}px`;
    // element.style.top = "30%"; // Используем проценты для адаптивности
    return element;
  }

  canAccept(card) {
    if (card.value === "A") false;
    else if (this.cards.length === 0) {
      return card.value === "K";
    } else {

      const topCard = this.cards[this.cards.length - 1];
      return (
        card.color !== topCard.color &&
        this.getValueIndex(card.value) === this.getValueIndex(topCard.value) - 1
      );
    }

  }

  addCard(card) {
    card.indexTableau = this.index;
    card.position = this.cards.length;
    card.parent = 'tableau';
    this.cards.push(card);
  }

  removeCard(card) {
    console.log('удаление карты из массива tableau');
    
    const index = this.cards.indexOf(card);
    if (index !== -1) {
      this.cards.splice(index, 1);
      // Обновляем позиции оставшихся карт
      for (let i = index; i < this.cards.length; i++) {
        this.cards[i].position = i;
      }
    }
  }

  updateCardPositions() {
    this.cards.forEach((card, index) => {
      card.position = index;
    });
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

  flipTopCard() {
    if (this.cards.length > 0) {
      const topCard = this.cards[this.cards.length - 1];
      if (!topCard.faceUp) {
        topCard.flip();
        return true;
      }
    }
    return false;
  }
}
