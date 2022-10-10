"use strict";

const basketCounterEl = document.querySelector('.cartIconWrap span');
const basketTotalEl = document.querySelector('.basketTotal');
const basketTotalValueEl = document.querySelector('.basketTotalValue');
const basketEl = document.querySelector('.basket');

// Создаём событие, при клике показывает или скрывает окно корзины
document.querySelector('.cartIconWrap').addEventListener('click', () => {
    basketEl.classList.toggle('hidden');
});

// Объект для нашей корзины
const basket = {};

document.querySelector('.featuredItems').addEventListener('click', event => {
    // Если кликаем мимо, то ничего не делаем
    if (!event.target.closest('.addToCart')) {
        return;
    }
    // Если кликнули куда нужно, то находим что нужно
    const featuredItem = event.target.closest('.featuredItem');
    const id = +featuredItem.dataset.id;
    const name = featuredItem.dataset.name;
    const price = +featuredItem.dataset.price;
    // и добавляем в корзину
    addToCart(id, name, price);
});

function addToCart(id, name, price) {
    // Если товара нет, то создаём новый
    if (!(id in basket)) {
        basket[id] = {id, name, price, count: 0};
    }
    // Если товар повторяется, то изменяем его количество
    basket[id].count++;
    // Меняем цифру кол-ва товаров на значке корзины
    basketCounterEl.textContent = getTotalBasketCount();
    // Меняем общую сумму
    basketTotalValueEl.textContent = getTotalBasketPrice().toFixed(2);
    // Отображаем товар с id
    renderProductInBasket(id);
}

// Получаем цифру кол-ва товаров на значке корзины
function getTotalBasketCount() {
    return Object.values(basket).reduce((acc, product) => acc + product.count, 0);
}

// Получаем общую сумму
function getTotalBasketPrice() {
    return Object.values(basket)
        .reduce((acc, product) => acc + product.count * product.price, 0);
}


function renderProductInBasket(id) {
    // Получаем нужную строку для проверки
    const basketRowEl = basketEl
        .querySelector(`.basketRow[data-productId="${id}"]`);
    // Если товара нет, то он его отобразит, иначе пропустит
    if (!basketRowEl) {
        renderNewProductInBasket(id);
        return;
    }
    
    // Меняем количество товара, если он уже добавлен
    basketRowEl.querySelector('.productCount').textContent = basket[id].count;
    // Меняем суммарную итоговую стоимость текущего товара
    basketRowEl.querySelector('.productTotalRow')
        .textContent = basket[id].count * basket[id].price;
}

// Функция отображения товара
function renderNewProductInBasket(productId) {
    // html код товара в корзине
    const productRow = `
    <div class="basketRow" data-productId="${productId}">
        <div>${basket[productId].name}</div>
        <div>
            <span class="productCount">${basket[productId].count}</span> шт.
        </div>
        <div>$${basket[productId].price}</div>
        <div>
            $<span class="productTotalRow">${(basket[productId].price * basket[productId].count)}</span>
        </div>
    </div>
    `;
    // Вставляем код перед последней строчкой в окне корзины
    basketTotalEl.insertAdjacentHTML('beforebegin', productRow);
}