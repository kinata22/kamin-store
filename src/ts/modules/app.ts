import { Routes } from './routes/routes';
import ProductsList from './products-list/products-list';
import ProductDetails from './product-details/product-details';

class App {
    route: Routes;
    productsList: ProductsList;
    productDetails: ProductDetails | null;
    constructor() {
        this.route = new Routes();
        this.productsList = new ProductsList(this.route, this);
        this.productDetails = null;
        if (this.route.product && this.route.product > -1) {
            this.productDetails = new ProductDetails(this.route.product, this);
            this.productDetails.drawDetails();
        } else {
            this.productsList.draw();
            this.productsList.drawSide();
            this.productsList.drawCheckboxValues();
            this.productsList.drawPages();
        }
    }
}

export default App;
