import './sass/main.scss';
//import ProductDetails from './ts/modules/product-details/product-details';
console.log(123);
import App from './ts/modules/app';
const app = new App();
console.log(123);
const select = document.getElementsByTagName('select')[0];
select.addEventListener('change', function () {
    app.route.setSortOder(this.value);
    app.productsList.setSortOder(this.value);
});

const priceMin = document.getElementById('priceMin');
if (priceMin) {
    priceMin.addEventListener('mousedown', function () {
        app.productsList.moveRange(this);
    });
}
const priceMax = document.getElementById('priceMax');
if (priceMax) {
    priceMax.addEventListener('mousedown', function () {
        app.productsList.moveRange(this);
    });
}
const weightMax = document.getElementById('weightMax');
if (weightMax) {
    weightMax.addEventListener('mousedown', function () {
        app.productsList.moveRange(this);
    });
}
const weightMin = document.getElementById('weightMin');
if (weightMin) {
    weightMin.addEventListener('mousedown', function () {
        app.productsList.moveRange(this);
    });
}
const cartButton = document.getElementById('cart');
if (cartButton) {
    cartButton.addEventListener('click', function () {
        window.location.href = 'index.html?cart=1';
    });
}
window.addEventListener('resize', function () {
    app.productsList.moveBegunokToStart();
});

window.onpopstate = function () {
    location.reload();
};
