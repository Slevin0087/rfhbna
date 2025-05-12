// Конфигурация
const CACHE_NAME = "husinka";
const OFFLINE_PAGE = "offline.html";
const ASSETS_TO_CACHE = [
  // Основные файлы
  "/",
  "index.html",
  "./css/style2.css",
  "./css/menu.css",
  "./css/settings.css",
  "./css/shop.css",
  "./css/shop2.css",
  "./css/shopBackCards.css",
  "main.js",
  "offline.html",

  // Иконки и манифест
  "manifest.json",
  "./assets/icons/icon192.png",
  "./assets/icons/icon512.png",

  //   // Изображения карт (пример)
  //   '/assets/cards/back.png',
  //   '/assets/cards/2h.png',
  //   '/assets/cards/2d.png',
  //   // ... остальные карты

  // Звуки
    "./assets/sounds/background.mp3",
    "./assets/sounds/win.mp3",
    "./assets/sounds/card-flip.mp3",
    "./assets/sounds/info.mp3",
    "./assets/sounds/click.mp3",

      // Фон
    "./assets/shop/fons/fon_1.jpg",
    "./assets/shop/fons/fon_2.jpg",
    "./assets/shop/fons/fon_3.jpg",
    "./assets/shop/fons/fon_4.jpg"
];

// 1. Установка и кэширование ресурсов
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Кэширование основных файлов");
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch((err) => {
        console.error("[SW] Ошибка кэширования:", err);
      })
  );
});

// 2. Активация и очистка старого кэша
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Удаление старого кэша:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. Стратегия: "Сначала кэш, потом сеть" + оффлайн-страница
self.addEventListener("fetch", (event) => {
  // Игнорируем POST-запросы и аналитику
  if (
    event.request.method !== "GET" ||
    event.request.url.includes("google-analytics")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Возвращаем кэш, если есть
      if (cachedResponse) {
        return cachedResponse;
      }

      // Иначе пробуем сеть + кэшируем для будущего
      return fetch(event.request)
        .then((response) => {

            ////////// добавил
          if (response.status === 206) {
            return response;
          }
          //////////

          // Клонируем ответ для кэша
          const responseToCache = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache));
          return response;
        })
        .catch(() => {
          // Оффлайн-страница для HTML-запросов
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match(OFFLINE_PAGE);
          }
        });
    })
  );
});

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     fetch(event.request)
//       .then((response) => {
//         // Не кэшируем частичные ответы (206)
//         if (response.status === 206) {
//           return response;
//         }

//         // Клонируем ответ для кэширования
//         const responseToCache = response.clone();
//         caches
//           .open(CACHE_NAME)
//           .then((cache) => cache.put(event.request, responseToCache));

//         return response;
//       })
//       .catch(() => caches.match(event.request))
//   );
// });

// 4. Фоновое обновление (опционально)
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
