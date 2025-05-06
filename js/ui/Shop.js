export class Shop {
  constructor() {
    this.items = [
      { id: "skin1", name: "Ретро-карты", price: 100, owned: false },
      { id: "skin2", name: "Готический стиль", price: 200, owned: false },
    ];
    this.initEventListeners();
  }

  initEventListeners() {
    document.querySelectorAll(".buy-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        console.log('e:', e);
        
        const dataStyle = e.target.dataset.fonBtn;
        if (dataStyle) {
          let bd = document.querySelector('body').style;
          bd.background = "url(assets/shop/fons/fon_1.jpg) no-repeat center center fixed";
          console.log('bd:', bd);
          
        }
        // this.buyItem(itemId);
        console.log('dataStyle:', dataStyle);
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
