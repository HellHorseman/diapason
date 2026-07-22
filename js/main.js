const REPO_OWNER = 'HellHorseman';
const REPO_NAME = 'diapason';

async function loadContent() {
    const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/data/content.json?t=${Date.now()}`;
    
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            applyContent(data);
        } else {
            console.log('Контент ещё не создан, используем HTML по умолчанию');
        }
    } catch (error) {
        console.log('Не удалось загрузить контент, используем HTML по умолчанию');
    }
}

function applyContent(data) {
    document.querySelectorAll('[data-field]').forEach(el => {
        const field = el.getAttribute('data-field');
        if (data[field]) {
            el.textContent = data[field];
        }
    });
    
    // Услуги
    if (data.services && data.services.length) {
        const container = document.getElementById('services-grid');
        if (container) {
            container.innerHTML = data.services.map(service => `
                <div class="service-card">
                    <div class="service-icon">${service.icon || '🔧'}</div>
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                </div>
            `).join('');
        }
    }
    
    // Оборудование
    if (data.equipment && data.equipment.length) {
        const container = document.getElementById('equipment-grid');
        if (container) {
            container.innerHTML = data.equipment.map(item => `
                <div class="equipment-card" data-category="${item.category}">
                    <div class="equipment-image">${item.icon || '🔊'}</div>
                    <div class="equipment-info">
                        <div class="equipment-category">${item.category_label || item.category}</div>
                        <h3>${item.name}</h3>
                        <p class="equipment-desc">${item.description || ''}</p>
                        <div class="equipment-price">${item.price || 'по запросу'}</div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Мобильное меню
document.querySelector('.mobile-menu-btn')?.addEventListener('click', function() {
    const nav = document.querySelector('.nav-links');
    if (nav) {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.top = '70px';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.background = '#0a0a0a';
        nav.style.padding = '20px';
        nav.style.gap = '20px';
    }
});

// Табы для оборудования
const tabs = document.querySelectorAll('.tab-btn');
const equipmentGrid = document.getElementById('equipment-grid');

function filterEquipment(category) {
    const cards = document.querySelectorAll('.equipment-card');
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        filterEquipment(tab.getAttribute('data-category'));
    });
});

function openQuoteForm() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
}

function scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
}

function scrollToEquipment() {
    document.getElementById('equipment')?.scrollIntoView({ behavior: 'smooth' });
}

function scrollToServices() {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
}

function goToShop() {
    window.open('http://dpsnshop.ru', '_blank', 'noopener,noreferrer');
}

// Обработка формы
document.getElementById('callback-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const button = form.querySelector('button');
    const originalText = button.textContent;
    
    button.textContent = 'Отправка...';
    button.disabled = true;
    
    // Здесь можно добавить отправку на бэкенд или Telegram бота
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    button.textContent = '✅ Заявка отправлена!';
    form.reset();
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
});

loadContent();