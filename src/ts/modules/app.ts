import ProductsList from './products-list/products-list';
import { Routes } from './routes/routes';

class App {
    start() {
        console.log('start');

        const route = new Routes();
        const productsList = new ProductsList(route);
        productsList.draw();
        productsList.drawSide();
    }
}

export default App;
