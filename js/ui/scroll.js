
    const shopItems = document.querySelector('.shop-items');
    const scrollLeftBtn = document.querySelector('.scroll-btn.left');
    const scrollRightBtn = document.querySelector('.scroll-btn.right');
    const itemWidth = 150; // Ширина одного элемента + gap
    let scrollPosition = 0;
  
    // Функция обновления состояния кнопок
    function updateScrollButtons() {
      scrollLeftBtn.disabled = scrollPosition === 0;
      scrollRightBtn.disabled = scrollPosition >= shopItems.scrollWidth - shopItems.clientWidth;
    }
  
    // Прокрутка влево
    scrollLeftBtn.addEventListener('click', () => {
      scrollPosition = Math.max(0, scrollPosition - itemWidth);
      shopItems.style.transform = `translateX(-${scrollPosition}px)`;
      updateScrollButtons();
    });
  
    // Прокрутка вправо
    scrollRightBtn.addEventListener('click', () => {
      const maxScroll = shopItems.scrollWidth - shopItems.clientWidth;
      scrollPosition = Math.min(maxScroll, scrollPosition + itemWidth);
      shopItems.style.transform = `translateX(-${scrollPosition}px)`;
      updateScrollButtons();
    });
  
    // Инициализация кнопок
    updateScrollButtons();
  
    // Адаптация при изменении размера окна
    window.addEventListener('resize', updateScrollButtons);