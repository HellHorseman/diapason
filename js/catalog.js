const categories = {
    light: {
        name: 'Световое оборудование',
        images: [
            'images/light/1.jpg',
            'images/light/2.jpg',
            'images/light/3.jpg',
            'images/light/4.jpg',
        ]
    },
    sound: {
        name: 'Звуковое оборудование',
        images: [
            'images/sound/1.jpg',
            'images/sound/2.jpg',
            'images/sound/3.jpg',
            'images/sound/4.jpg',
        ]
    },
    stage: {
        name: 'Сценические конструкции',
        images: [
            'images/stage/1.jpg',
            'images/stage/2.jpg',
            'images/stage/3.jpg',
            'images/stage/4.jpg',
        ]
    }
};

const popup = document.getElementById('popup');
const popupClose = document.getElementById('popup-close');
const track = document.getElementById('carousel-track');
const dotsContainer = document.getElementById('carousel-dots');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentCategory = 'light';
let currentIndex = 0;
let totalImages = 0;

document.querySelectorAll('.equipment-card').forEach(card => {
    card.addEventListener('click', function() {
        const category = this.dataset.category;
        if (category && categories[category]) {
            openPopup(category);
        }
    });
});

function closePopup() {
    popup.classList.remove('active');
    document.body.style.overflow = 'auto';
}

popupClose.addEventListener('click', closePopup);

popup.addEventListener('click', function(e) {
    if (e.target === this) {
        closePopup();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePopup();
    }
    if (e.key === 'ArrowLeft') {
        prevSlide();
    }
    if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

function openPopup(category) {
    currentCategory = category;
    currentIndex = 0;

    const data = categories[category];
    if (!data || !data.images.length) {
        console.warn('Нет картинок для категории:', category);
        return;
    }

    totalImages = data.images.length;

    // Строим карусель
    renderCarousel(data.images);
    renderDots(totalImages);
    updateCarousel();

    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function renderCarousel(images) {
    track.innerHTML = '';
    images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Оборудование';
        img.loading = 'lazy';
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
    if (currentIndex < totalImages - 1) {
        currentIndex++;
        updateCarousel();
    } else {
        currentIndex = 0;
        updateCarousel();
    }
}

function prevSlide() {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    } else {
        currentIndex = totalImages - 1;
        updateCarousel();
    }
}

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

console.log('✅ Каталог загружен!');