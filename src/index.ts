import './sass/main.scss';

import hello from './ts/hello';
hello();

import App from './ts/modules/app';
const app = new App();

const select = document.getElementsByTagName('select')[0];
select.addEventListener('change', function () {
    app.route.setSortOder(this.value);
    app.productsList.setSortOder(this.value);
});
