import { Routes } from './routes/routes';
import ProductsList from './products-list/products-list';
import ProductDetails from './product-details/product-details';

class App {
    route: Routes;
    productsList: ProductsList;
    productDetails: ProductDetails;
    constructor() {
        this.route = new Routes();
        this.productsList = new ProductsList(this.route);
        this.productsList.draw();
        this.productsList.drawSide();
        this.productsList.drawCheckboxValues();
        this.productsList.drawPages();

        this.productDetails = new ProductDetails(1);
        this.productDetails.drawDetails();
    }
}

export default App;
