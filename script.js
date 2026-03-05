/**
 * BOOKSPACE CORE ENGINE
 * Весь интерактив проекта собран здесь
 */

 document.addEventListener('DOMContentLoaded', () => {

    // 1. КАСТОМНЫЙ КУРСОР
    const cursor = document.createElement('div');
    cursor.id = 'cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const interactiveElements = document.querySelectorAll('a, button, .book-card, .book-page');
    interactiveElements.forEach(el => {
        el.onmouseenter = () => cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
        el.onmouseleave = () => cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // 2. СЛОЖНЫЙ СЛАЙДЕР (HERO)
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const nextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        };
        setInterval(nextSlide, 7000);
    }

    // 3. СИСТЕМА ФИЛЬТРАЦИИ
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.book-card');

    const applyFilters = () => {
        const activeGenre = document.querySelector('.f-genre.active').dataset.val;
        const activeAuthor = document.querySelector('.f-author.active').dataset.val;

        cards.forEach(card => {
            const gMatch = activeGenre === 'all' || card.dataset.genre === activeGenre;
            const aMatch = activeAuthor === 'all' || card.dataset.author === activeAuthor;
            
            if (gMatch && aMatch) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 10);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 500);
            }
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.parentElement;
            parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilters();
        });
    });

    // 4. 3D READER LOGIC
    const reader = document.getElementById('readerOverlay');
    const bookPages = document.querySelectorAll('.book-page');
    let zIndexCounter = bookPages.length;

    // Инициализация слоев страниц
    bookPages.forEach((page, i) => {
        page.style.zIndex = zIndexCounter - i;
    });

    window.openReader = () => {
        reader.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    window.closeReader = () => {
        reader.style.display = 'none';
        document.body.style.overflow = 'auto';
        bookPages.forEach(p => p.classList.remove('flipped'));
    };

    bookPages.forEach((page, i) => {
        page.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!page.classList.contains('flipped')) {
                page.classList.add('flipped');
                // После переворота уменьшаем z-index, чтобы можно было кликнуть на предыдущую (если нужно назад)
                setTimeout(() => { page.style.zIndex = i; }, 500);
            } else {
                page.classList.remove('flipped');
                setTimeout(() => { page.style.zIndex = zIndexCounter - i; }, 500);
            }
        });
    });

    // 5. REVEAL ANIMATION (SCROLL)
    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', reveal);
    reveal(); // Запуск при загрузке

    // 6. КОРЗИНА (ЭФФЕКТ) И УВЕДОМЛЕНИЯ
    window.addToCart = (name) => {
        const msg = document.createElement('div');
        // ИЗМЕНЕНО: Проверка, что именно мы отправляем
        msg.innerHTML = name === 'Заявка' ? `Ваше сообщение успешно отправлено` : `Книга "${name}" добавлена в корзину!`;
        msg.style.cssText = `
            position: fixed; bottom: 30px; right: 30px; 
            background: var(--accent); color: white; padding: 20px 40px;
            z-index: 5000; font-weight: 700; border-radius: 4px;
            animation: slideIn 0.5s forwards;
        `;
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
    };
            // Логика переключения одной новинки на другую
    const trackN = document.getElementById('noveltyTrack');
    const btnPrevN = document.getElementById('prevNov');
    const btnNextN = document.getElementById('nextNov');

    if(trackN) {
        btnNextN.onclick = () => {
            trackN.style.transform = 'translateX(-100%)';
        };
        btnPrevN.onclick = () => {
            trackN.style.transform = 'translateX(0)';
        };
    }
});

// Анимация для уведомлений
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
