import './sass/main.scss';

import hello from './ts/hello';
hello();

import App from './ts/modules/app';
const app = new App();
app.start();
