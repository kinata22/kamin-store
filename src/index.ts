import './sass/main.scss';
import './sass/slider.scss';
//import { SortOder } from './ts/modules/routes/routes';
//import ProductsList from './ts/modules/products-list/products-list';

import hello from './ts/hello';
hello();

import App from './ts/modules/app';
const app = new App();

const select = document.getElementsByTagName('select')[0];
select.addEventListener('change', function () {
    app.route.setSortOder(this.value);
    app.productsList.setSortOder(this.value);
});

/*
const pages = document.querySelectorAll('.b-page');
for (let i = 0; i < pages.length; i++) {
    const numPage: number = parseInt(pages[i].innerHTML);
    pages[i].addEventListener('click', function () {
        app.route.setPage(numPage);
        app.productsList.setPage(numPage);
    });
}
*/

//import Slider from './ts/slider';
//const slider = new Slider();
import './ts/slider';
const sliders = document.querySelectorAll('price');
for (let i = 0; i < sliders.length; i++) {
    sliders[i].addEventListener('mousedown', function () {
        //moveRange(this);
    });
    sliders[i].addEventListener('touchstart', function () {
        //moveRange(this);
    });
}
