import { Routes } from './routes/routes';
import ProductsList from './products-list/products-list';
import ProductDetail from './product-details/product-details';
import Cart from './cart/cart';
import ModalWin from './modal/modal';
class App {
    route: Routes;
    productsList: ProductsList;
    productDetails: ProductDetail | null;
    cart: Cart | null;
    modalWin: ModalWin | null;
    constructor() {
        this.route = new Routes();
        this.productsList = new ProductsList(this.route, this);
        this.productDetails = null;
        this.cart = new Cart(this);
        this.modalWin = new ModalWin(this);
        if (this.route.product && this.route.product > -1) {
            this.productDetails = new ProductDetail(this.route.product, this);
            this.productDetails.drawDetails();
        } else if (this.route.cart && this.route.cart === 1) {
            this.cart.drawCart();
        } else {
            this.productsList.draw();
            this.productsList.drawSide();
            this.productsList.drawCheckboxValues();
            this.productsList.drawPages();
        }
    }
}

export default App;
