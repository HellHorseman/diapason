// ===== ДИНАМИЧЕСКАЯ ЗАГРУЗКА ГАЛЕРЕЙ ИЗ JSON =====

// Кэш, чтобы не дёргать fetch при каждом открытии попапа
const galleryCache = {};

// Путь к JSON-файлу для конкретной категории
function getGalleryPath(category) {
    return `data/galleries/${category}/${category}.json`;
}

// Асинхронно загружаем фотографии из JSON
async function loadGallery(category) {
    if (galleryCache[category]) {
        return galleryCache[category];
    }

    try {
        const res = await fetch(getGalleryPath(category));
        if (!res.ok) {
            throw new Error(`Не найден файл: ${getGalleryPath(category)}`);
        }
        const data = await res.json();
        // Превращаем массив объектов [{image: "..."}] в массив строк ["..."]
        const images = (data.photos || []).map(p => p.image).filter(Boolean);
        galleryCache[category] = images;
        return images;
    } catch (error) {
        console.error('Ошибка загрузки галереи:', error);
        return [];
    }
}

// ===== DOM-ЭЛЕМЕНТЫ =====
const popup = document.getElementById('popup');
const popupClose = document.getElementById('popup-close');
const track = document.getElementById('carousel-track');
const dotsContainer = document.getElementById('carousel-dots');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentIndex = 0;
let totalImages = 0;

// ===== ОТКРЫТИЕ ПОПАПА =====
async function openPopup(category) {
    // Пока грузим — можно показать попап с пустым состоянием или спиннером
    const images = await loadGallery(category);

    if (!images.length) {
        console.warn('Нет картинок для категории:', category);
        return;
    }

    currentIndex = 0;
    totalImages = images.length;

    renderCarousel(images);
    renderDots(totalImages);
    updateCarousel();

    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePopup() {
    popup.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ===== РЕНДЕР КАРУСЕЛИ =====
function renderCarousel(images) {
    track.innerHTML = '';
    images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Оборудование';
        img.loading = 'lazy';
        // Если картинка не найдена — показываем заглушку (если она есть)
        img.onerror = function() {
            this.src = 'images/placeholder.jpg';
        };
        track.appendChild(img);
    });
}

function renderDots(total) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.dataset.index = i;
        dot.addEventListener('click', function() {
            currentIndex = parseInt(this.dataset.index);
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
    }
}

function updateCarousel() {
    const width = track.querySelector('img')?.clientWidth || 0;
    track.style.transform = `translateX(-${currentIndex * width}px)`;

    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

function nextSlide() {
    if (!totalImages) return;
    currentIndex = (currentIndex + 1) % totalImages;
    updateCarousel();
}

function prevSlide() {
    if (!totalImages) return;
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    updateCarousel();
}

// ===== ОБРАБОТЧИКИ =====
document.querySelectorAll('.equipment-card').forEach(card => {
    card.addEventListener('click', function() {
        const category = this.dataset.category;
        if (category) {
            openPopup(category);
        }
    });
});

popupClose.addEventListener('click', closePopup);

popup.addEventListener('click', function(e) {
    if (e.target === this) {
        closePopup();
    }
});

document.addEventListener('keydown', function(e) {
    if (!popup.classList.contains('active')) return;
    if (e.key === 'Escape') closePopup();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// ===== АДАПТИВ ПРИ ИЗМЕНЕНИИ РАЗМЕРА =====
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (popup.classList.contains('active')) {
            updateCarousel();
        }
    }, 100);
});

// ===== БУРГЕР-МЕНЮ =====
document.querySelector('.mobile-menu-btn')?.addEventListener('click', function() {
    const nav = document.querySelector('.nav-links');
    if (nav) {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.top = '70px';
        nav.style.left = '0';
        nav.style.width = '100%';
        nav.style.background = 'rgba(10,10,10,0.98)';
        nav.style.padding = '20px';
        nav.style.gap = '16px';
    }
});

console.log('✅ Каталог готов (динамические галереи)');