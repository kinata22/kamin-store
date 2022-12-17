import ProductsList from './products-list/products-list';

class App {
    start() {
        console.log('start');

        const productsList = new ProductsList();
        productsList.draw();
        productsList.drawSide();
    }
}

export default App;
