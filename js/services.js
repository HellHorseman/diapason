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