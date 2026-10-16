// ==========================================
// ПРОКРУТКА К НАЧАЛУ КАТАЛОГА
// ==========================================

function scrollToCatalog() {

    if (!window.matchMedia("(max-width: 767px)").matches) return;

    requestAnimationFrame(() => {

        const catalog = document.querySelector(".katalog");

        if (!catalog) return;

        catalog.scrollIntoView({
            behavior: "instant",
            block: "start"
        });

    });
}

// ==========================================
// ПЕРЕКЛЮЧЕНИЕ АДРЕСОВ КОФЕЕН
// ==========================================

const locationButtons = document.querySelectorAll(".location-select");

const locationMap = document.querySelector("#location-map");
const locationName = document.querySelector("#location-name");
const locationAddress = document.querySelector("#location-address");

locationButtons.forEach((button) => {

    button.addEventListener("click", () => {

        locationButtons.forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        if (locationName) {
            locationName.textContent = button.dataset.name || "";
        }

        if (locationAddress) {
            locationAddress.textContent = button.dataset.address || "";
        }

        if (locationMap && button.dataset.map) {
            locationMap.src = button.dataset.map;
        }

    });

});


// ==========================================
// ОБЩИЕ АНИМАЦИИ ПРИ ПРОКРУТКЕ
// ==========================================

const animatedElements = document.querySelectorAll(
    ".scroll-animation:not(.about-gallery-card):not(.ocoffe-text):not(.atmosphere-photo):not(.club-level)"
);

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        entry.target.classList.add("show");

        observer.unobserve(entry.target);

    });

}, {
    threshold: 0.1,
    rootMargin: "0px 0px -10% 0px"
});

animatedElements.forEach((element) => {
    observer.observe(element);
});


// ==========================================
// ФОТОГРАФИИ «О НАШЕЙ КОФЕЙНЕ»
// ==========================================

const aboutPhotos = document.querySelectorAll(".about-gallery-card");

const aboutGallery = document.querySelector(".about-gallery");

if (aboutPhotos.length && aboutGallery) {

    const photoObserver = new IntersectionObserver((entries) => {

        if (!entries[0].isIntersecting) return;

        photoObserver.disconnect();

        // Первая фотография проявляется

        aboutPhotos[0].classList.add("about-photo-visible");

        // Вторая фотография поднимается снизу

        aboutPhotos.forEach((card, index) => {

            if (index === 0) return;

            setTimeout(() => {

                card.classList.add("about-photo-visible");

            }, index * 300);

        });

    }, {
        threshold: 0.2,
        rootMargin: "0px 0px -15% 0px"
    });

    photoObserver.observe(aboutGallery);
}


// ==========================================
// КАРТОЧКИ КЛУБНЫХ УРОВНЕЙ
// ==========================================

const levelCards = document.querySelectorAll(".club-level");

const levelSection = document.querySelector(".club-levels");

if (levelCards.length && levelSection) {

    const levelObserver = new IntersectionObserver((entries) => {

        if (!entries[0].isIntersecting) return;

        levelObserver.disconnect();

        levelCards.forEach((card, index) => {

            setTimeout(() => {

                card.classList.add("level-visible");

            }, index * 180);

        });

    }, {
        threshold: 0.2,
        rootMargin: "0px 0px -15% 0px"
    });

    levelObserver.observe(levelSection);
}


// ==========================================
// ФОТОГРАФИИ «АТМОСФЕРА»
// ==========================================

const magnetCards = document.querySelectorAll(".atmosphere-photo");

const atmosphereGallery = document.querySelector(".atmosphere-gallery");

if (magnetCards.length && atmosphereGallery) {

    const magnetObserver = new IntersectionObserver((entries) => {

        if (!entries[0].isIntersecting) return;

        magnetObserver.disconnect();

        // Пять фотографий появляются по очереди

        magnetCards.forEach((card, index) => {

            setTimeout(() => {

                card.classList.add("magnet-visible");

            }, index * 170);

        });

    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -15% 0px"
    });

    magnetObserver.observe(atmosphereGallery);
}


// ==========================================
// ПЕЧАТАНИЕ ТЕКСТА «О НАШЕЙ КОФЕЙНЕ»
// ==========================================

const aboutText = document.querySelector(".text-ocoffe");

if (
    aboutText &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {

    const originalHTML = aboutText.innerHTML;

    const originalHeight = aboutText.getBoundingClientRect().height;

    aboutText.style.minHeight = originalHeight + "px";

    // Создаём контейнер с исходным HTML

    const source = document.createElement("div");

    source.innerHTML = originalHTML;

    const textNodes = [];

    const walker = document.createTreeWalker(
        source,
        NodeFilter.SHOW_TEXT
    );

    let node;

    while ((node = walker.nextNode())) {

        const parents = [];

        let parent = node.parentElement;

        while (parent && parent !== source) {

            parents.unshift(parent);

            parent = parent.parentElement;
        }

        textNodes.push({
            text: node.textContent,
            parents: parents
        });
    }

    // Очищаем текст до начала анимации

    aboutText.innerHTML = "";

    let nodeIndex = 0;
    let charIndex = 0;
    let currentTextNode = null;


    // ==========================================
    // ПЕЧАТАНИЕ СИМВОЛОВ
    // ==========================================

    function typeCharacter() {

        // Пропускаем завершённые и пустые текстовые узлы

        while (
            nodeIndex < textNodes.length &&
            charIndex >= textNodes[nodeIndex].text.length
        ) {

            nodeIndex++;
            charIndex = 0;
            currentTextNode = null;
        }

        // Если весь текст напечатан

        if (nodeIndex >= textNodes.length) {

            aboutText.innerHTML = originalHTML;

            return;
        }

        const current = textNodes[nodeIndex];

        // Создаём текстовый узел и его HTML-обёртки

        if (currentTextNode === null) {

            let container = aboutText;

            current.parents.forEach((parent) => {

                const clone = parent.cloneNode(false);

                container.appendChild(clone);

                container = clone;
            });

            currentTextNode = document.createTextNode("");

            container.appendChild(currentTextNode);
        }

        // Печатаем символ

        currentTextNode.textContent += current.text[charIndex];

        charIndex++;

        // Пробелы и переносы добавляем без задержки

        while (
            charIndex < current.text.length &&
            /\s/.test(current.text[charIndex])
        ) {

            currentTextNode.textContent += current.text[charIndex];

            charIndex++;
        }

        setTimeout(typeCharacter, 18);
    }


    // ==========================================
    // ЗАПУСК ПЕЧАТАНИЯ ПРИ ПРОКРУТКЕ
    // ==========================================

    const typingObserver = new IntersectionObserver((entries) => {

        if (!entries[0].isIntersecting) return;

        typingObserver.disconnect();

        typeCharacter();

    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px"
    });

    typingObserver.observe(aboutText);
}

// ==========================================
// НАВИГАЦИЯ САЙТА
// ==========================================

// Кнопка «Посмотреть меню»

const heroMenuButton = document.querySelector(".hero-btn-left");

heroMenuButton.addEventListener("click", () => {

    document.querySelector("#menu").scrollIntoView({
        behavior: "smooth"
    });

});


// Кнопка «Найти кофейню»

const heroLocationsButton = document.querySelector(".hero-btn-right");

heroLocationsButton.addEventListener("click", () => {

    document.querySelector("#locations").scrollIntoView({
        behavior: "smooth"
    });

});


// Кнопка «Забронировать» использует ссылку tel: в HTML.

// ==========================================
// ТОВАРЫ КОФЕЙНИ
// ==========================================

const products = [

    // ==========================================
    // КЛАССИЧЕСКИЙ КОФЕ
    // ==========================================

    {
        id: 1,
        name: "Флэт Уайт",
        category: "coffee",
        image: "images/menu/flat-white.webp",
        prices: { S: 290, M: 310 },
        popular: true,
    },
    {
        id: 2,
        name: "Капучино",
        category: "coffee",
        image: "images/menu/cappuccino.webp",
        prices: { S: 250, M: 290, L: 310 },
        popular: true,
    },
    {
        id: 3,
        name: "Латте",
        category: "coffee",
        image: "images/menu/latte.webp",
        prices: { S: 250, M: 290, L: 310 },
        popular: false,
    },
    {
        id: 4,
        name: "Раф",
        category: "coffee",
        image: "images/menu/raf.webp",
        prices: { M: 330, L: 390 },
        popular: true,
    },
    {
        id: 5,
        name: "Эспрессо",
        category: "coffee",
        image: "images/menu/flat-white.webp",
        prices: { S: 200 },
        popular: false
    },
    {
        id: 6,
        name: "Американо",
        category: "coffee",
        image: "images/menu/flat-white.webp",
        prices: { M: 290 },
        popular: false
    },
    {
        id: 7,
        name: "Фильтр-кофе",
        category: "coffee",
        image: "images/menu/flat-white.webp",
        prices: { M: 290 },
        popular: false
    },
    {
        id: 8,
        name: "Воронка V60 / Kalita",
        category: "coffee",
        image: "images/menu/flat-white.webp",
        prices: { M: 350 },
        popular: false
    },

    // ==========================================
    // АВТОРСКИЙ КОФЕ
    // ==========================================

    {
        id: 9,
        name: "СЖА™",
        category: "signature",
        image: "images/menu/cappuccino.webp",
        prices: { M: 350, L: 410 },
        popular: false
    },
    {
        id: 10,
        name: "Халва",
        category: "signature",
        image: "images/menu/cappuccino.webp",
        prices: { M: 350, L: 410 },
        popular: false
    },
    {
        id: 11,
        name: "Биг Флэт",
        category: "signature",
        image: "images/menu/cappuccino.webp",
        prices: { M: 300, L: 330 },
        popular: false
    },
    {
        id: 12,
        name: "Бреве Ваниль",
        category: "signature",
        image: "images/menu/cappuccino.webp",
        prices: { M: 320, L: 380 },
        popular: false
    },
    {
        id: 13,
        name: "Раф Лаванда Blue",
        category: "signature",
        image: "images/menu/cappuccino.webp",
        prices: { M: 330, L: 390 },
        popular: false
    },
    {
        id: 14,
        name: "Раф Черешня Rose",
        category: "signature",
        image: "images/menu/cappuccino.webp",
        prices: { M: 330, L: 390 },
        popular: false
    },
    {
        id: 15,
        name: "Раф Лесной Орех",
        category: "signature",
        image: "images/menu/cappuccino.webp",
        prices: { M: 330, L: 390 },
        popular: false
    },

    // ==========================================
    // НЕ КОФЕ
    // ==========================================

    {
        id: 16,
        name: "Матча Латте",
        category: "noncoffee",
        image: "images/menu/desserts-tiramisu-cheesecake.webp",
        prices: { M: 290, L: 350 },
        popular: false
    },
    {
        id: 17,
        name: "Масала пряный CHAI латте",
        category: "noncoffee",
        image: "images/menu/combo-sandwich-coffee.webp",
        prices: { M: 340, L: 380 },
        popular: false
    },
    {
        id: 18,
        name: "Какао горький",
        category: "noncoffee",
        image: "images/menu/desserts-croissant-cookie-brownie.webp",
        prices: { M: 340, L: 380 },
        popular: true
    },
    {
        id: 19,
        name: "Хотчо™",
        category: "noncoffee",
        image: "images/menu/matcha-and-cocoa.webp",
        prices: { M: 340, L: 380 },
        popular: false
    },
    {
        id: 20,
        name: "Чай",
        category: "noncoffee",
        image: "images/menu/iced-latte-and-orange-coffee.webp",
        prices: { L: 400 },
        popular: false
    },

    // ==========================================
    // ХОЛОДНЫЕ НАПИТКИ
    // ==========================================

    {
        id: 21,
        name: "Бамбл Оранж",
        category: "cold",
        image: "images/menu/desserts-brownie-cheesecake.webp",
        prices: { M: 350 },
        popular: false
    },
    {
        id: 22,
        name: "Айс Латте",
        category: "cold",
        image: "images/menu/lavender-coffee.webp",
        prices: { M: 350 },
        popular: false
    },
    {
        id: 23,
        name: "Кофе-тоник",
        category: "cold",
        image: "images/menu/iced-latte-and-espresso.webp",
        prices: { M: 350 },
        popular: false
    },
    {
        id: 24,
        name: "Лимонад",
        category: "cold",
        image: "images/menu/desserts-tiramisu-cheesecake.webp",
        prices: { M: 350 },
        popular: false
    },

    // ==========================================
    // ЕДА И ДЕСЕРТЫ
    // ==========================================

    {
        id: 25,
        name: "Альфахор",
        category: "food",
        image: "images/menu/combo-sandwich-coffee.webp",
        prices: { one: 180 },
        popular: false
    },
    {
        id: 26,
        name: "Кукис",
        category: "food",
        image: "images/menu/desserts-croissant-cookie-brownie.webp",
        prices: { one: 180 },
        popular: false
    },
    {
        id: 27,
        name: "Кукис Нью-Йорк",
        category: "food",
        image: "images/menu/matcha-and-cocoa.webp",
        prices: { one: 250 },
        popular: false
    },
    {
        id: 28,
        name: "Круассан миндальный / ягодный",
        category: "food",
        image: "images/menu/iced-latte-and-orange-coffee.webp",
        prices: { one: 350 },
        popular: false
    },
    {
        id: 29,
        name: "Будин",
        category: "food",
        image: "images/menu/desserts-brownie-cheesecake.webp",
        prices: { one: 330 },
        popular: false
    },
    {
        id: 30,
        name: "Брауни",
        category: "food",
        image: "images/menu/lavender-coffee.webp",
        prices: { one: 350 },
        popular: false
    },
    {
        id: 31,
        name: "Тирамису",
        category: "food",
        image: "images/menu/iced-latte-and-espresso.webp",
        prices: { one: 350 },
        popular: false
    },
    {
        id: 32,
        name: "Чизкейк",
        category: "food",
        image: "images/menu/desserts-tiramisu-cheesecake.webp",
        prices: { one: 350 },
        popular: false
    },

    // ==========================================
    // ГОТОВЫЕ НАБОРЫ
    // ==========================================

    {
        id: 33,
        name: "Сэндвич с тунцом + Американо",
        category: "combo",
        image: "images/menu/combo-sandwich-coffee.webp",
        prices: { one: 640 },
        popular: false
    },
    {
        id: 34,
        name: "Сэндвич с курицей + Капучино M",
        category: "combo",
        image: "images/menu/desserts-croissant-cookie-brownie.webp",
        prices: { one: 640 },
        popular: false
    },
    {
        id: 35,
        name: "Сырники домашние + Раф Пряный M",
        category: "combo",
        image: "images/menu/matcha-and-cocoa.webp",
        prices: { one: 680 },
        popular: false
    },
    {
        id: 36,
        name: "Круассан миндаль + Флэт Уайт M",
        category: "combo",
        image: "images/menu/iced-latte-and-orange-coffee.webp",
        prices: { one: 660 },
        popular: false
    },
    {
        id: 37,
        name: "Будин пряная тыква + Бреве Ваниль M",
        category: "combo",
        image: "images/menu/desserts-brownie-cheesecake.webp",
        prices: { one: 650 },
        popular: false
    },
    {
        id: 38,
        name: "Фильтр-кофе + Брауни",
        category: "combo",
        image: "images/menu/lavender-coffee.webp",
        prices: { one: 640 },
        popular: false
    },
    {
        id: 39,
        name: "Капучино S + Круассан",
        category: "combo",
        image: "images/menu/iced-latte-and-espresso.webp",
        prices: { one: 600 },
        popular: false
    },
    {
        id: 40,
        name: "2 × Капучино S + Кукис миндаль",
        category: "combo",
        image: "images/menu/desserts-tiramisu-cheesecake.webp",
        prices: { one: 680 },
        popular: false
    },

    // ==========================================
    // ДОБАВКИ
    // ==========================================

    {
        id: 41,
        name: "Сироп",
        category: "extra",
        image: "images/menu/combo-sandwich-coffee.webp",
        prices: { S: 30, M: 40, L: 50 },
        popular: false
    },
    {
        id: 42,
        name: "Другое молоко",
        category: "extra",
        image: "images/menu/desserts-croissant-cookie-brownie.webp",
        prices: { S: 50, M: 60, L: 70 },
        popular: false
    }

];

// ==========================================
// КАТАЛОГ CAFFESHOP
// ==========================================

const categoryButtons = document.querySelectorAll(".menu-category");
const menuGrid = document.querySelector(".menu-grid");

const pagination = document.querySelector(".menu-pagination");
const paginationDots = document.querySelector(".menu-pagination-dots");
const paginationButtons = pagination?.querySelectorAll(":scope > button");

let activeCategory = "popular";
let currentPage = 1;

const productsPerPage = 6;


// ==========================================
// СОЗДАНИЕ КАРТОЧКИ ТОВАРА
// ==========================================

function createProductCard(product) {

    const card = document.createElement("article");
    card.className = "menu-card";

    if (product.popular) {
    const hit = document.createElement("span");

    hit.className = "menu-card-hit";
    hit.textContent = "ХИТ";

    card.appendChild(hit);
    }

    const image = document.createElement("div");
    image.className = "menu-card-image";

    if (product.image) {
        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;
        img.loading = "lazy";
        img.decoding = "async";
        image.appendChild(img);
    }

    const content = document.createElement("div");
    content.className = "menu-card-content";

    const title = document.createElement("h3");
    title.textContent = product.name;

    const sizes = document.createElement("div");
    sizes.className = "menu-sizes";

    Object.entries(product.prices).forEach(([size, price]) => {
        const priceElement = document.createElement("span");

        priceElement.textContent = size === "one"
            ? `${price} ₽`
            : `${size} · ${price} ₽`;

        sizes.appendChild(priceElement);
    });

    content.appendChild(title);
    content.appendChild(sizes);

    card.appendChild(image);
    card.appendChild(content);

    return card;
}


// ==========================================
// ФИЛЬТРАЦИЯ ТОВАРОВ
// ==========================================

function getFilteredProducts() {

    return products.filter((product) => {

        if (activeCategory === "popular") {
            return product.popular;
        }

        return product.category === activeCategory;

    });
}


// ==========================================
// ОТОБРАЖЕНИЕ ТОВАРОВ
// ==========================================

function renderProducts() {

    if (!menuGrid) return;

    // Проверяем, открыт ли сайт на телефоне
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    // Получаем товары выбранной категории
    const filteredProducts = getFilteredProducts();

    // Считаем страницы для компьютерной версии
    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / productsPerPage)
    );

    currentPage = Math.min(currentPage, totalPages);

    const startIndex = (currentPage - 1) * productsPerPage;

    // На телефоне показываем все товары категории
    // На компьютере только 6 товаров
    const visibleProducts = isMobile
        ? filteredProducts
        : filteredProducts.slice(
            startIndex,
            startIndex + productsPerPage
        );

    // Очищаем старые карточки
    menuGrid.replaceChildren();

    // Создаём новые карточки
    visibleProducts.forEach((product) => {

        const card = createProductCard(product);

        menuGrid.appendChild(card);

    });

    // На телефоне скрываем переключение страниц
    if (isMobile) {

        if (pagination) {
            pagination.style.display = "none";
        }

    } else {

        renderPagination(totalPages);

    }
}

// ==========================================
// АДАПТАЦИЯ КАТАЛОГА
// ==========================================

const catalogMobileQuery = window.matchMedia("(max-width: 767px)");

catalogMobileQuery.addEventListener("change", () => {

    currentPage = 1;

    renderProducts();

});


// ==========================================
// ПЕРЕКЛЮЧЕНИЕ КАТЕГОРИЙ
// ==========================================

categoryButtons.forEach((button) => {

    button.addEventListener("click", () => {

        activeCategory = button.dataset.category;

        currentPage = 1;

        categoryButtons.forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        renderProducts();

    });

});


// ==========================================
// ПАГИНАЦИЯ
// ==========================================

function renderPagination(totalPages) {

    if (!pagination || !paginationDots) return;

    pagination.style.display = totalPages > 1 ? "" : "none";

    paginationDots.replaceChildren();

    for (let page = 1; page <= totalPages; page++) {

        const dot = document.createElement("button");

        dot.type = "button";

        dot.setAttribute("aria-label", `Страница ${page}`);

        if (page === currentPage) {
            dot.classList.add("active");
        }

        dot.addEventListener("click", () => {

        currentPage = page;

        renderProducts();

        scrollToCatalog();

    });

        paginationDots.appendChild(dot);
    }

    if (paginationButtons?.[0]) {
        paginationButtons[0].disabled = currentPage === 1;
    }

    if (paginationButtons?.[1]) {
        paginationButtons[1].disabled = currentPage === totalPages;
    }
}


// ==========================================
// СТРЕЛКИ ПАГИНАЦИИ
// ==========================================

if (paginationButtons?.length === 2) {

    paginationButtons[0].addEventListener("click", () => {

        if (currentPage > 1) {
            currentPage--;
            renderProducts();
            scrollToCatalog();
        }

    });

    paginationButtons[1].addEventListener("click", () => {

        const totalPages = Math.max(
            1,
            Math.ceil(getFilteredProducts().length / productsPerPage)
        );

        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
            scrollToCatalog();
        }

    });

}


// ==========================================
// ЗАПУСК КАТАЛОГА
// ==========================================

renderProducts();

// ==========================================
// МОБИЛЬНАЯ НАВИГАЦИЯ
// ==========================================

const mobileNav = document.querySelector(".mobile-bottom-nav");

if (mobileNav) {

    // Находим ссылки нижней панели, ведущие к разделам
    const navLinks = [
        ...mobileNav.querySelectorAll('a[href^="#"]')
    ];

    // Связываем каждую кнопку с её разделом
    const sections = navLinks
    .map((link) => {

        const href = link.getAttribute("href");

        const section = href && href.length > 1
            ? document.getElementById(href.slice(1))
            : null;

        return { link, section };

    })
    .filter((item) => item.section);


// Сортируем разделы по их реальному положению на странице
sections.sort((a, b) => {

    const position = a.section.compareDocumentPosition(b.section);

    return position & Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1;

});


    // ==========================================
    // ПЛАВНАЯ ПРОКРУТКА
    // ==========================================

    navLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const target = document.querySelector(
                link.getAttribute("href")
            );

            if (!target) return;

            event.preventDefault();

            navLinks.forEach((item) => {
            item.classList.toggle("active", item === link);
            });

            const offset = 85;

            const top =
                window.scrollY +
                target.getBoundingClientRect().top -
                offset;

            const distance = Math.abs(window.scrollY - top);

            window.scrollTo({
            top: Math.max(0, top),
            behavior: distance > window.innerHeight * 1.5
                ? "instant"
                : "smooth"
            });

        });

    });


    // ==========================================
    // ОПРЕДЕЛЕНИЕ АКТИВНОГО РАЗДЕЛА
    // ==========================================

    let scheduled = false;

    function updateMobileNavActive() {

        scheduled = false;

        if (
            !window.matchMedia("(max-width: 767px)").matches ||
            !sections.length
        ) return;

        // Проверяем раздел примерно на трети высоты экрана

        const marker = window.scrollY + window.innerHeight * 0.4;

        let active = sections[0];

        sections.forEach((item) => {

            const sectionTop =
                window.scrollY +
                item.section.getBoundingClientRect().top;

            if (sectionTop <= marker) {
                active = item;
            }

        });

        // Подсвечиваем только активную кнопку
        navLinks.forEach((link) => {

            link.classList.toggle(
                "active",
                link === active.link
            );

        });

    }


    // ==========================================
    // ОТСЛЕЖИВАНИЕ ПРОКРУТКИ
    // ==========================================

    function scheduleMobileNavUpdate() {

        if (scheduled) return;

        scheduled = true;

        requestAnimationFrame(updateMobileNavActive);

    }

    window.addEventListener(
        "scroll",
        scheduleMobileNavUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        scheduleMobileNavUpdate
    );

    scheduleMobileNavUpdate();

}