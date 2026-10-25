// === ПРОВЕРКА ТЕМЫ ===
(function () {
    try {
        var saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') {
            document.documentElement.dataset.theme = saved;
        }
    } catch (e) { console.warn("localStorage недоступен") }
})();

// === МЕНЮ ===
document.addEventListener('DOMContentLoaded', () => {
	console.log("HELLO!");
    const menuButton = document.getElementById('menuButton');
    const bottomLine = document.getElementById('bottomLine');
    const menuLabel = menuButton.querySelector('.menu-button__text');

    // Сами пункты меню: скрипт создаёт эти элементы
    // и добавляет внутрь div.bottom-line
    const MENU_ITEMS = [
        { text: 'Главная', href: '#' },
        { text: 'О проекте', href: '#' },
    ];

    let nav = null;
    let fallbackTimer = null;

    // Создание элементов и добавление ВНУТРЬ div.bottom-line
    function buildNav() {
        nav = document.createElement('nav');
        nav.className = 'nav';
        nav.id = 'siteNav';
        nav.setAttribute('aria-label', 'Основная навигация');
        menuButton.setAttribute('aria-controls', 'siteNav');

        const ul = document.createElement('ul');
        for (const item of MENU_ITEMS) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.href;
            a.textContent = item.text;
            li.appendChild(a);
            ul.appendChild(li);
        }
        nav.appendChild(ul);
        bottomLine.appendChild(nav); /* <-- элементы добавляются в div.bottom-line */
    }

    // Удаление элементов из div.bottom-line
    function removeNav() {
        clearTimeout(fallbackTimer);
        if (nav) {
            nav.remove();
            nav = null;
        }
    }

    // Этап 1: блок начинает плавно раздвигаться
    function openMenu() {
        clearTimeout(fallbackTimer);
        menuButton.setAttribute('aria-expanded', 'true');
        menuLabel.textContent = 'Закрыть';
        buildNav(); /* элементы уже в div, но пока скрыты */
        bottomLine.classList.add('open');
        /* высота открытого блока — ровно по контенту, а не фиксированная */
        bottomLine.style.height = nav.offsetHeight + 'px';

        /* Страховка, если transitionend не сработает */
        fallbackTimer = setTimeout(() => bottomLine.classList.add('ready'), 600);
    }

    // Блок сдвигается обратно; элементы удаляются после сдвига
    function closeMenu() {
        clearTimeout(fallbackTimer);
        menuButton.setAttribute('aria-expanded', 'false');
        menuLabel.textContent = 'Меню';
        bottomLine.classList.remove('ready');
        bottomLine.classList.remove('open');
        bottomLine.style.height = ''; /* возврат к 1px из CSS */
    }

    menuButton.addEventListener('click', () => {
        bottomLine.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Этап 2: блок раздвинулся до конца — показываем добавленные элементы
    bottomLine.addEventListener('transitionend', (event) => {
        if (event.target !== bottomLine || event.propertyName !== 'height') return;

        if (bottomLine.classList.contains('open')) {
            clearTimeout(fallbackTimer);
            bottomLine.classList.add('ready');
        } else {
            removeNav(); /* блок сдвинулся — элементы удаляются из div */
        }
    });

    // Закрытие после клика по ссылке
    bottomLine.addEventListener('click', (event) => {
        if (event.target.closest('.nav a')) closeMenu();
    });

    // Пересчёт высоты при изменении окна (пункты могут переехать на другую строку)
    window.addEventListener('resize', () => {
        if (nav && bottomLine.classList.contains('open')) {
            bottomLine.style.height = nav.offsetHeight + 'px';
        }
    });

    // ===== Переключение темы: по умолчанию следует системе =====
    const themeButton = document.getElementById('themeButton');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    function currentTheme() {
        const t = document.documentElement.dataset.theme;
        if (t === 'light' || t === 'dark') return t;
        return systemDark.matches ? 'dark' : 'light';
    }

	// === ПЕРЕКЛЧАТЕЛЬ ТЕМЫ ===
    themeButton.addEventListener('click', () => {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem('theme', next); } catch (e) { /* приватный режим */ }
    });
});