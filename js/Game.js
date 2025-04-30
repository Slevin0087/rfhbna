import { Deck } from "./Deck.js";
import { Foundation } from "./Foundation.js";
import { Tableau } from "./Tableau.js";
// import { Stock } from './Stock.js';
import { Stock } from "./Stock.js";
import { AudioManager } from './ui/Audio.js';
import { GameStorage } from './utils/Storage.js';

export class Game {
  constructor() {
    this.audio = new AudioManager();
    this.storage = GameStorage;
    this.settings = this.storage.getSettings();
    
    // Инициализация с учётом настроек
    this.audio.toggle(this.settings.sound);
    this.gameContainer = document.getElementById("game-container");
    this.rowElement = document.getElementById("row");
    console.log('this.gameContainer:', this.gameContainer);
    
    this.messageEl = document.getElementById("message");
    this.stockDivEl = document.getElementById("stockDiv");
    this.foundationsDiv = document.getElementById("foundationsDiv");
    this.tableausEl = document.getElementById("tableausDiv");
    this.selectedCard = null;
    this.selectedCardElement = null;
    this.hintTimeout = null;
    this.eventClientX = null;
    this.eventClientY = null;
    this.foundationElement = document.elementFromPoint(
      this.eventClientX,
      this.eventClientY
    );

    this.deck = new Deck();
    // console.log('this.deck:', this.deck);
    this.foundations = Array.from({ length: 4 }, (_, i) => new Foundation(i));
    this.tableaus = Array.from({ length: 7 }, (_, i) => new Tableau(i));
    this.stock = new Stock();
  }

  init() {
    this.clearGame();
    this.setupGame();
    this.renderGame();
    this.setupEventListeners();
    this.messageEl.textContent = "Игра началась, Хусин!";
  }

  clearGame() {
    this.gameContainer.innerHTML = "";
    this.rowElement.innerHTML = "";
    this.stockDivEl.innerHTML = "";
    this.tableausEl.innerHTML = "";
    this.selectedCard = null;
    this.selectedCardElement = null;
    clearTimeout(this.hintTimeout);
    this.hintTimeout = null;

    this.deck = new Deck();
    this.foundations = Array.from({ length: 4 }, (_, i) => new Foundation(i));
    this.tableaus = Array.from({ length: 7 }, (_, i) => new Tableau(i));
    this.stock = new Stock();
  }

  setupGame() {
    this.deck.shuffle();
    // Раздаем карты в tableau
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j <= i; j++) {
        const card = this.deck.deal();
        card.faceUp = j === i; // Последняя карта в столбце открыта
        this.tableaus[i].addCard(card);
      }
    }

    // Оставшиеся карты идут в сток
    const stockCards = [];
    while (!this.deck.isEmpty()) {
      console.log('while (!this.deck.isEmpty())');
      
      stockCards.push(this.deck.deal());
    }
    
    this.stock.addCards(stockCards);
    console.log('this.stock:', this.stock);
  }

  renderGame() {
    // Добавляем элементы в DOM

    // this.gameContainer.appendChild(this.stock.wasteElement);
    this.gameContainer.append(this.rowElement, this.tableausEl);
    this.rowElement.append(this.stockDivEl, this.foundationsDiv);
    
    this.stockDivEl.appendChild(this.stock.element);
    this.stockDivEl.appendChild(this.stock.wasteElement);
    
    this.foundations.forEach((foundation) => {
      this.foundationsDiv.appendChild(foundation.element);
    });
    
    this.tableaus.forEach((tableau) => {      
      this.tableausEl.appendChild(tableau.element);
    });
    // Рендерим карты
    this.renderCards();
  }

  renderCards() {
    console.log("renders");

    // Очищаем старые карты
    document.querySelectorAll(".card").forEach((el) => el.remove());
    // Рендерим карты в tableau
    console.log("this.tableaus:", this.tableaus);
    this.tableaus.forEach((tableau, i) => {
      tableau.cards.forEach((card, j) => {
        this.renderCard(card, `tableau-${i}`, j);
      });
    });

    // Рендерим карты в foundations
    this.foundations.forEach((foundation, i) => {
      if (foundation.cards.length > 0) {
        const card = foundation.cards[foundation.cards.length - 1];
        this.renderCard(card, `foundation-${i}`, 0);
      }
    });

    // Рендерим карту в waste
    const wasteCard = this.stock.getCurrentCard();
    if (wasteCard) {
      
      wasteCard.wasteCard = true;
      console.log('wasteCard:', wasteCard);
      this.renderCard(wasteCard, "waste", 0);
    }
  }

  renderCard(card, containerId, offset) {
    console.log("render");
    const container = document.getElementById(containerId);

    // console.log('container.getBoundingClientRect():', container.getBoundingClientRect().left);
    if (!container) return;
    const stateContainer = container.getBoundingClientRect();
    // console.log('stateContainer:', stateContainer);
    card.containerRectLeft = stateContainer.left;
    card.containerRectTop = stateContainer.top;
    card.containerRectWidth = stateContainer.width;
    card.containerRectHeight = stateContainer.height;
    // console.log('card:', card);
    
    const cardElement = document.createElement("div");
    const spanElementLeft = document.createElement("span");
    const spanElementCenter = document.createElement("span");
    const spanElementRight = document.createElement("span");
    cardElement.className = `card ${card.color}`;
    spanElementLeft.className = 'top-left';
    spanElementCenter.className = 'center';
    spanElementRight.className = 'bottom-right';
    spanElementLeft.textContent = `${card.getSymbol()}`;
    spanElementCenter.textContent = card.suit;
    spanElementRight.textContent = `${card.getSymbol()}`;
    cardElement.append(spanElementLeft, spanElementCenter, spanElementRight);
    // card.getSymbol();
    const cStyle = window.getComputedStyle(container);
    const cStyleBorderRadius = parseInt(cStyle.borderRadius);
    // console.log('cStyleBorderRadius:', cStyleBorderRadius);

    // console.log('cardElement.style.left:', typeof cardElement.style.left);
    cardElement.style.position = "absolute";
    cardElement.style.left = -cStyleBorderRadius / 2 + "px";

    if (containerId.startsWith("tableau-")) {
      // console.log('if:');
      cardElement.style.top = offset * 25 - cStyleBorderRadius / 2 + "px";
    } else {
      cardElement.style.top = -cStyleBorderRadius / 2 + "px";
    }

    if (!card.faceUp) {
      cardElement.classList.add("card-back");
    }

    cardElement.dataset.suit = card.suit;
    cardElement.dataset.value = card.value;
    cardElement.dataset.color = card.color;

    if (card.faceUp) {
      // this.handleCardClick(card, cardElement)
      cardElement.addEventListener("click", () =>
        this.handleCardClick(card)
      );
    } else if (containerId.startsWith("tableau-")) {
      const column = parseInt(containerId.split("-")[1]);
      cardElement.addEventListener("click", () => {
        this.tableaus[column].flipTopCard();
        this.renderCards();
      });
    }

    // this.gameContainer.appendChild(cardElement);
    container.appendChild(cardElement);
    card.parentElement = container;
    card.cardEl = cardElement;
  }

  // handleCardClick(card, cardElement) {
  //   console.log("клик по карте");
  //   // this.selectCard(card, cardElement);
  //   if (this.selectedCard) {
  //     // console.log('if (this.selectedCard)');
  //     this.tryMoveCard(this.selectedCard, card);
  //     this.clearSelection();
  //   } else {
  //     // console.log('if (this.selectedCard) ELSE');
  //     this.selectCard(card, cardElement);
  //   }
  // }

  addCoins(amount) {
    const current = parseInt(localStorage.getItem('gameCoins') || 0);
    localStorage.setItem('gameCoins', current + amount);
  }
  
  // Вызывать при успешных действиях:
  // this.addCoins(10); // За каждую карту в дом
  // this.addCoins(50); // За победу

  applySkin(skinId) {
    const skin = {
      skin1: { back: 'url(retro-back.png)', colors: { red: '#c00', black: '#333' }},
      skin2: { back: 'url(gothic-back.png)', colors: { red: '#900', black: '#111' }}
    };
    
    document.documentElement.style.setProperty('--card-back', skin[skinId].back);
    document.documentElement.style.setProperty('--red-color', skin[skinId].colors.red);
  }

  handleCardClick(card) {
    // 1. Проверяем Foundation
    for (let i = 0; i < this.foundations.length; i++) {
      if (this.foundations[i].canAccept(card)) {
        this.moveCardToFoundation(card, i);
        if (this.checkWin()) {
          this.messageEl.textContent = "Поздравляем! Вы выиграли!";
        }
        return;
      }
    }
  
    // 2. Проверяем Tableau
    for (let i = 0; i < this.tableaus.length; i++) {
      if (this.tableaus[i].canAccept(card)) {
        this.moveCardToTableau(card, i);
        return;
      }
    }
  
    // 3. Если никуда нельзя
    this.messageEl.textContent = "Нельзя переместить карту";
    setTimeout(() => this.messageEl.textContent = "", 1500);
  }

  selectCard(card, cardElement) {
    this.selectedCard = card;
    this.selectedCardElement = cardElement;
    cardElement.style.transform = "translateY(-10px)";
  }

  clearSelection() {
    if (this.selectedCardElement) {
      this.selectedCardElement.style.transform = "";
      this.selectedCardElement = null;
    }
    this.selectedCard = null;
  }

  tryMoveCard(fromCard, toCard) {
    // 1. Попытка переместить в foundation
    if (this.tryMoveToFoundation(fromCard, toCard)) {
      this.messageEl.textContent = "";
      if (this.checkWin()) {
        this.messageEl.textContent = "Поздравляем! Вы выиграли!";
      }
      return true;
    }

    // 2. Попытка переместить в tableau
    if (this.tryMoveToTableau(fromCard, toCard)) {
      this.messageEl.textContent = "";
      return true;
    }

    this.messageEl.textContent = "Невозможно переместить карту";
    return false;
  }

  tryMoveToFoundation(fromCard, toCard) {
    // console.log("if tryMoveToFoundation this.foundations:", this.foundations);
    // console.log("fromCard:", fromCard);
    // console.log("toCard:", toCard);
    // Определяем foundation по карте или позиции курсора
    let foundationIndex;

    if (toCard && toCard.foundation) {
      foundationIndex = this.foundations.findIndex((f) => {
        // console.log('f.cards:', f.cards);

        f.cards.includes(toCard);
      });
      // console.log("if tryMoveToFoundation foundationIndex:", foundationIndex);
    } else {
      // console.log("else :")
      // );
      // const foundationElement = document.elementFromPoint(
      //   this.eventClientX,
      //   this.eventClientY
      // );
      // console.log(
      //   "else tryMoveToFoundation this.foundationElement:",
      //   this.foundationElement
      // );
      if (this.foundationElement && this.foundationElement.id.startsWith("foundation-")) {
        foundationIndex = parseInt(this.foundationElement.id.split("-")[1]);
      } else {
        return false;
      }
    }

    // Проверяем возможность перемещения
    if (
      foundationIndex !== -1 &&
      this.foundations[foundationIndex].canAccept(fromCard)
    ) {
      // Удаляем карту из текущего положения
      this.removeCardFromCurrentPosition(fromCard);

      // Добавляем в foundation
      this.foundations[foundationIndex].addCard(fromCard);

      // Обновляем отображение
      this.renderCards();
      return true;
    }

    return false;
  }

  tryMoveToTableau(fromCard, toCard) {
    // Определяем столбец tableau по карте или позиции курсора
    let columnIndex;

    if (toCard && !toCard.foundation) {
      // console.log("if tryMoveToTableau");
      columnIndex = toCard.column;
    } else {
      const tableauElement = document.elementFromPoint(
        parseInt(this.selectedCardElement.style.left) + 35,
        parseInt(this.selectedCardElement.style.top) + 50
      );

      if (tableauElement && tableauElement.id.startsWith("tableau-")) {
        columnIndex = parseInt(tableauElement.id.split("-")[1]);
      } else {
        return false;
      }
    }

    // Проверяем возможность перемещения
    if (
      columnIndex !== undefined &&
      this.tableaus[columnIndex].canAccept(fromCard)
    ) {
      // Удаляем карту из текущего положения
      this.removeCardFromCurrentPosition(fromCard);

      // Добавляем в tableau
      this.tableaus[columnIndex].addCard(fromCard);

      // Обновляем отображение
      this.renderCards();
      return true;
    }

    return false;
  }

  moveCardToFoundation(card, foundationIndex) {
    this.removeCardFromCurrentPosition(card);
    this.foundations[foundationIndex].addCard(card);
    this.foundations[foundationIndex].element.appendChild(card.cardEl)
    this.renderCards();
  }
  
  moveCardToTableau(card, tableauIndex) {
    this.removeCardFromCurrentPosition(card);
    this.tableaus[tableauIndex].addCard(card);
    this.tableaus[tableauIndex].element.appendChild(card.cardEl);
    this.renderCards();
  }

  removeCardFromCurrentPosition(card) {
    // Ищем карту в tableau
    for (let tableau of this.tableaus) {
      const index = tableau.cards.indexOf(card);
      if (index !== -1) {
        tableau.removeCard(card);
        card.parentElement.removeChild(card.cardEl)
        return;
      }
    }

    // Ищем карту в waste (стоке)
    const wasteCard = this.stock.getCurrentCard();
    if (wasteCard === card) {
      this.stock.index--;
      const cardFilter = this.stock.cards.filter((c) => c !== card);
      this.stock.cards = cardFilter;
      console.log('cardFilter:', cardFilter);
      console.log('this.stock.cards:', this.stock.cards);
      return;
    }

    // Ищем карту в foundations
    for (let foundation of this.foundations) {
      const index = foundation.cards.indexOf(card);
      if (index !== -1) {
        foundation.cards.splice(index, 1);
        card.parentElement.removeChild(card.cardEl);
        return;
      }
    }
  }

  showHint() {
    this.clearHint();

    // 1. Проверяем карту в waste (стоке)
    const wasteCard = this.stock.getCurrentCard();
    if (wasteCard) {
      // Можно ли переместить в foundation?
      for (let i = 0; i < this.foundations.length; i++) {
        if (this.foundations[i].canAccept(wasteCard)) {
          this.highlightCard(wasteCard);
          this.highlightFoundation(i);
          this.messageEl.textContent =
            "Можно переместить карту из стока в foundation";
          this.setHintTimeout();
          return;
        }
      }

      // Можно ли переместить в tableau?
      for (let i = 0; i < this.tableaus.length; i++) {
        if (this.tableaus[i].canAccept(wasteCard)) {
          this.highlightCard(wasteCard);
          this.highlightTableau(i);
          this.messageEl.textContent = `Можно переместить карту из стока в столбец ${
            i + 1
          }`;
          this.setHintTimeout();
          return;
        }
      }
    }

    // 2. Проверяем карты в tableau
    for (let i = 0; i < this.tableaus.length; i++) {
      if (this.tableaus[i].cards.length > 0) {
        const topCard =
          this.tableaus[i].cards[this.tableaus[i].cards.length - 1];

        // Можно ли переместить в foundation?
        for (let j = 0; j < this.foundations.length; j++) {
          if (this.foundations[j].canAccept(topCard)) {
            this.highlightCard(topCard);
            this.highlightFoundation(j);
            this.messageEl.textContent = `Можно переместить карту из столбца ${
              i + 1
            } в foundation`;
            this.setHintTimeout();
            return;
          }
        }

        // Можно ли переместить в другой tableau?
        for (let j = 0; j < this.tableaus.length; j++) {
          if (i !== j && this.tableaus[j].canAccept(topCard)) {
            this.highlightCard(topCard);
            this.highlightTableau(j);
            this.messageEl.textContent = `Можно переместить карту из столбца ${
              i + 1
            } в столбец ${j + 1}`;
            this.setHintTimeout();
            return;
          }
        }
      }
    }

    // 3. Проверяем карты в foundation
    for (let i = 0; i < this.foundations.length; i++) {
      if (this.foundations[i].cards.length > 0) {
        const topCard =
          this.foundations[i].cards[this.foundations[i].cards.length - 1];

        // Можно ли переместить в tableau?
        for (let j = 0; j < this.tableaus.length; j++) {
          if (this.tableaus[j].canAccept(topCard)) {
            this.highlightCard(topCard);
            this.highlightTableau(j);
            this.messageEl.textContent = `Можно переместить карту из foundation в столбец ${
              j + 1
            }`;
            this.setHintTimeout();
            return;
          }
        }
      }
    }

    this.messageEl.textContent =
      "Подсказка: нет доступных ходов, попробуйте раздать карты из стока";
  }

  highlightCard(card) {
    const cardElement = this.findCardElement(card);
    if (cardElement) {
      cardElement.style.boxShadow = "0 0 10px 5px yellow";
    }
  }

  highlightFoundation(index) {
    const element = document.getElementById(`foundation-${index}`);
    if (element) {
      element.style.boxShadow = "0 0 10px 5px yellow";
      element.style.borderColor = "yellow";
    }
  }

  highlightTableau(index) {
    const element = document.getElementById(`tableau-${index}`);
    if (element) {
      element.style.boxShadow = "0 0 10px 5px yellow";
      element.style.borderColor = "yellow";
    }
  }

  findCardElement(card) {
    const elements = document.querySelectorAll(".card");
    for (let element of elements) {
      if (
        element.dataset.suit === card.suit &&
        element.dataset.value === card.value &&
        element.style.display !== "none"
      ) {
        return element;
      }
    }
    return null;
  }

  clearHint() {
    if (this.hintTimeout) {
      clearTimeout(this.hintTimeout);
      this.hintTimeout = null;
    }

    document
      .querySelectorAll(".card, .foundation, .card-placeholder")
      .forEach((el) => {
        el.style.boxShadow = "";
        if (el.classList.contains("foundation")) {
          el.style.borderColor = "white";
        } else if (el.classList.contains("card-placeholder")) {
          el.style.borderColor = "#ccc";
        }
      });
  }

  setHintTimeout() {
    this.hintTimeout = setTimeout(() => {
      this.clearHint();
      this.messageEl.textContent = "";
    }, 3000);
  }

  checkWin() {
    return this.foundations.every((f) => f.isComplete());
  }

  setupEventListeners() {
    this.stock.element.addEventListener("click", () => {
      this.stock.deal();
      this.renderCards();
    });

    // Обработчики для drag-and-drop
    document.addEventListener("mousemove", this.handleDrag.bind(this));
    document.addEventListener("mouseup", this.handleDrop.bind(this));
  }

  handleDrag(e) {
    if (this.selectedCardElement) {
      console.log('e.clientY:', e.clientX);
      // console.log('this.selectedCard.containerRectTop:', this.selectedCard.containerRectTop);
      this.eventClientX = e.clientX;
      this.eventClientY = e.clientY;
      this.selectedCardElement.style.left = e.clientX -  this.selectedCard.containerRectLeft - this.selectedCard.containerRectWidth / 2 + "px";
      this.selectedCardElement.style.top = e.clientY -  this.selectedCard.containerRectTop - this.selectedCard.containerRectHeight  / 2 + "px";
      this.selectedCardElement.style.zIndex = "1000";
    }
  }

  handleDrop() {
    // if (this.selectedCard && this.selectedCardElement) {
    //   // Пытаемся переместить карту
    //   // ...
    //   this.clearSelection();
    //   this.renderCards();
    // }
    if (!this.selectedCard) return;

    // Проверяем, куда положить карту
    const success =
      this.tryMoveToFoundation(this.selectedCard) ||
      this.tryMoveToTableau(this.selectedCard);

    if (!success) {
      // Возвращаем карту на место
      this.renderCards();
    }

    this.clearSelection();
  }
}
