import { Routes } from './routes/routes';
import ProductsList from './products-list/products-list';

class App {
    route: Routes;
    productsList: ProductsList;
    constructor() {
        this.route = new Routes();
        this.productsList = new ProductsList(this.route);
        this.productsList.draw();
        this.productsList.drawSide();
    }
}

export default App;
