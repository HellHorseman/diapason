function goToShop() {
    window.open('http://dpsnshop.ru', '_blank');
}

document.querySelector('.mobile-menu-btn')?.addEventListener('click', function() {
    const nav = document.querySelector('.nav-links');
    if (nav) {
        const isOpen = nav.style.display === 'flex';
        nav.style.display = isOpen ? 'none' : 'flex';
        if (!isOpen) {
            nav.style.flexDirection = 'column';
            nav.style.position = 'absolute';
            nav.style.top = '70px';
            nav.style.left = '0';
            nav.style.width = '100%';
            nav.style.background = 'rgba(10,10,10,0.98)';
            nav.style.padding = '20px';
            nav.style.gap = '16px';
            nav.style.zIndex = '999';
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Ищем карточку именно с data-category="service"
    const serviceCard = document.querySelector('.equipment-card[data-category="service"]');

    if (serviceCard) {
        serviceCard.style.cursor = 'pointer';
        serviceCard.addEventListener('click', (e) => {
            // Если кликнули по картинке магазина (у неё onclick) — не переходим
            if (e.target.closest('[onclick]')) return;
            window.location.href = 'contacts.html';
        });
    } else {
        console.warn('Карточка Сервиса не найдена');
    }
});