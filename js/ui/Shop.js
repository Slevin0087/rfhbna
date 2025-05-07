export class Shop {
  constructor() {
    this.items = [
      { id: "skin1", name: "Ретро-карты", price: 100, owned: false },
      { id: "skin2", name: "Готический стиль", price: 200, owned: false },
    ];
    this.initEventListeners();
  }

  initEventListeners() {
    this.handleByBtns();
  }

  handleByBtns() {
    document.querySelectorAll(".buy-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {        
        const dataStyle = e.target.dataset.fonBtn;
        if (dataStyle) {
          const bodyStyle = document.querySelector('body').style;
          bodyStyle.background = `url(assets/shop/fons/${dataStyle}) no-repeat center center fixed`;
          e.target.textContent = 'Куплено';
        }
        // this.buyItem(itemId);
      });
    });
  }
  
  buyItem(itemId) {
    const item = this.items.find((i) => i.id === itemId);
    const balance = parseInt(localStorage.getItem("gameCoins") || 0);

    if (balance >= item.price) {
      // Обновляем баланс
      localStorage.setItem("gameCoins", balance - item.price);

      // Разблокируем предмет
      const unlocked = JSON.parse(localStorage.getItem("unlockedItems") || []);
      unlocked.push(itemId);
      localStorage.setItem("unlockedItems", JSON.stringify(unlocked));

      // Обновляем отображение
      this.updateUI();
    } else {
      alert("Недостаточно монет!");
    }
  }

  updateUI() {
    const unlocked = JSON.parse(localStorage.getItem("unlockedItems") || []);

    this.items.forEach((item) => {
      const element = document.querySelector(`.item[data-id="${item.id}"]`);
      if (unlocked.includes(item.id)) {
        element.querySelector(".buy-btn").textContent = "Применить";
        element.querySelector(".buy-btn").classList.add("owned");
      }
    });

    document.getElementById("coins").textContent =
      localStorage.getItem("gameCoins") || 0;
  }
}
