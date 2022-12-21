import './sass/main.scss';
//import { SortOder } from './ts/modules/routes/routes';
//import ProductsList from './ts/modules/products-list/products-list';

import hello from './ts/hello';
hello();

import App from './ts/modules/app';
const app = new App();

const select = document.getElementsByTagName('select')[0];
select.addEventListener('change', function () {
    app.route.setSortOder(this.value);
    app.productsList.setSortOder(this.value, app.route);
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
