// Тольятти, ул. 70 лет Октября, 54А
const COORDINATES = [53.544059, 49.337461]; // [широта, долгота]
const ZOOM = 17;

const mapToggleBtn = document.getElementById('mapToggleBtn');
const contactMap = document.getElementById('contactMap');
const mapContainer = document.getElementById('map');

let mapInitialized = false;
let myMap = null;

function initMap() {
    if (mapInitialized) return;

    try {
        if (typeof ymaps === 'undefined') {
            console.warn('⚠️ Яндекс Карты API не загружен');
            showMapError('API не загружен. Проверьте подключение.');
            return;
        }

        ymaps.ready(function() {
            myMap = new ymaps.Map('map', {
                center: COORDINATES,
                zoom: ZOOM,
                controls: ['zoomControl', 'fullscreenControl']
            });

            myMap.options.set('preset', 'monochrome');

            myMap.events.add('ready', function() {
                document.getElementById('map').style.background = '#1a1a1e';

                try {
                    const mapCanvas = document.querySelector('#map canvas');
                    if (mapCanvas) {
                        mapCanvas.style.filter = 'grayscale(100%)';
                        mapCanvas.style.opacity = '0.85';
                    }
                } catch(e) {
                    console.log('Не удалось применить фильтр');
                }
            });

            var placemark = new ymaps.Placemark(
                COORDINATES,
                {
                    hintContent: 'Диапазон',
                    balloonContent: `
                        <div style="font-family: 'Inter', sans-serif; padding: 8px;">
                            <strong style="color: #0073A9; font-size: 16px;">Диапазон</strong><br>
                            <span style="color: #333; font-size: 14px;">ул. 70 лет Октября, 54А<br>Тольятти</span>
                            <br><br>
                            <a href="tel:+78482620402" style="color: #0073A9; text-decoration: none; font-size: 14px;">
                                📞 +7 (8482) 62-04-02
                            </a>
                        </div>
                    `
                },
                {
                    preset: 'islands#blueCircleIcon',
                    iconColor: '#0073A9',
                    balloonLayout: 'default#imageWithContent',
                    balloonPanelMaxMapArea: 0,
                    hideIconOnBalloonOpen: false,
                    draggable: false
                }
            );

            myMap.geoObjects.add(placemark);

            placemark.events.add('click', function() {
                placemark.balloon.open();
            });

            mapInitialized = true;
            console.log('✅ Яндекс Карта загружена! (серая тема)');

            // Обновляем карту после открытия
            setTimeout(function() {
                try {
                    myMap.container.fitToViewport();
                } catch(e) {}
            }, 600);
        });

    } catch (error) {
        console.error('❌ Ошибка загрузки карты:', error);
        showMapError('Ошибка загрузки карты');
    }
}

function showMapError(message) {
    mapContainer.innerHTML = `
        <div style="
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #121215;
            color: #5A5A60;
            font-size: 14px;
            padding: 24px;
            text-align: center;
            border-radius: 16px;
        ">
            <span style="font-size: 40px; margin-bottom: 12px;">🗺️</span>
            <p style="color: #ffffff; font-weight: 500; margin-bottom: 4px;">Карта временно недоступна</p>
            <p style="font-size: 13px; color: #5A5A60; margin-bottom: 12px;">${message}</p>
            <a href="https://yandex.ru/maps/?text=${COORDINATES[1]},${COORDINATES[0]}" 
               target="_blank" 
               style="
                   color: #0073A9;
                   text-decoration: none;
                   font-size: 14px;
                   border: 1px solid rgba(0, 115, 169, 0.3);
                   padding: 8px 24px;
                   border-radius: 20px;
                   transition: all 0.3s;
                   display: inline-block;
               "
               onmouseenter="this.style.background='rgba(0,115,169,0.1)'"
               onmouseleave="this.style.background='transparent'"
            >
                Открыть в Яндекс.Картах →
            </a>
        </div>
    `;
}

mapToggleBtn.addEventListener('click', function() {
    const isOpen = contactMap.classList.toggle('open');
    this.classList.toggle('active');

    const btnText = this.querySelector('.btn-text');
    if (isOpen) {
        btnText.textContent = 'Скрыть карту';
        // Инициализируем карту при первом открытии
        if (!mapInitialized) {
            setTimeout(initMap, 300);
        } else if (myMap) {
            // Если карта уже создана — обновляем
            setTimeout(function() {
                try {
                    myMap.container.fitToViewport();
                    // Применяем серый фильтр если ещё не применён
                    try {
                        const mapCanvas = document.querySelector('#map canvas');
                        if (mapCanvas && !mapCanvas.style.filter) {
                            mapCanvas.style.filter = 'grayscale(100%)';
                            mapCanvas.style.opacity = '0.85';
                        }
                    } catch(e) {}
                } catch(e) {}
            }, 400);
        }
    } else {
        btnText.textContent = 'Показать на карте';
    }
});

let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (mapInitialized && contactMap.classList.contains('open') && myMap) {
            try {
                myMap.container.fitToViewport();
            } catch (e) {
                console.warn('Не удалось обновить карту:', e);
            }
        }
    }, 300);
});

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

console.log('✅ Страница контактов загружена');