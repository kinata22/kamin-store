import ProductsList from './products-list/products-list';

class App {
    start() {
        console.log('start');

        const productsList = new ProductsList();
        productsList.draw();
    }
}

export default App;
