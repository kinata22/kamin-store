import './product-details.scss';

import { products } from '../../../assets/data/products';
import App from '../app';

class ProductDetail {
    //data: IProduct;
    id: number;
    name: string;
    price: number;
    category: string;
    weight: number;
    brand: string;
    quantity: number;
    img: string[];
    desc?: string;
    app: App;

    constructor(id: number, app: App) {
        this.id = id;
        const data = products.filter((x) => x.id === this.id)[0];
        this.name = data.name;
        this.price = data.price;
        this.category = data.category;
        this.weight = data.weight;
        this.brand = data.brand;
        this.img = data.img;
        this.desc = data.desc;
        this.quantity = data.quantity;
        this.app = app;
    }

    drawDetails() {
        let tmp: HTMLElement | null = document.querySelector('.page-product-list');
        if (tmp) tmp.style.display = 'none';
        tmp = document.querySelector('.page-cart');
        if (tmp) tmp.style.display = 'none';
        tmp = document.querySelector('.page-product-detail');
        if (tmp) tmp.style.display = 'block';
        const app = this.app;
        const id = this.id;

        // breadcrumps
        const linksCategory: HTMLImageElement | null = document.querySelector('.details-links-category');
        if (linksCategory) linksCategory.textContent = this.category;

        const linksBrand: HTMLImageElement | null = document.querySelector('.details-links-brand');
        if (linksBrand) linksBrand.textContent = this.brand ?? '';

        const linksName: HTMLImageElement | null = document.querySelector('.details-links-name');
        if (linksName) linksName.textContent = this.name;

        // product details
        const title: HTMLElement | null = document.querySelector('.title');
        if (title) title.textContent = this.name;
        //console.log(this.name);

        const imageSrc = `./images/${this.img[0]}`;
        const mainImage: HTMLImageElement | null = document.querySelector('.picture-main');
        if (mainImage) mainImage.src = imageSrc;

        const imagesContainer: HTMLElement | null = document.querySelector('.pictures-gallery');
        this.img.forEach((img: string, idx: number) => {
            console.log(idx, img);

            const div = document.createElement('div');

            const image = document.createElement('img');
            image.src = `./images/${this.img[idx]}`;

            image.addEventListener('click', function () {
                const mainImage: HTMLImageElement | null = document.querySelector('.picture-main');
                if (mainImage) mainImage.src = image.src;
            });

            div.appendChild(image);
            imagesContainer?.appendChild(div);
        });

        const priceFormatted = `€${this.price.toString()}`;
        console.log(this.price);

        const htmlItemPrice: HTMLImageElement | null = document.querySelector('.product-price');
        if (htmlItemPrice) htmlItemPrice.textContent = priceFormatted;

        const htmlItemId: HTMLImageElement | null = document.querySelector('.product-id');
        if (htmlItemId) htmlItemId.textContent = this.id.toString();

        const htmlItemCategory: HTMLImageElement | null = document.querySelector('.product-category');
        if (htmlItemCategory) htmlItemCategory.textContent = this.category;

        const weightElement: HTMLElement | null = document.querySelector('.product-weight');
        if (weightElement) weightElement.textContent = (this.weight ?? '').toString() + ' kg';

        const brandElement: HTMLElement | null = document.querySelector('.product-brand');
        if (brandElement) brandElement.textContent = this.brand ?? '';

        const stockElement: HTMLElement | null = document.querySelector('.product-stock');
        if (stockElement) stockElement.textContent = this.quantity.toString();

        const descElement: HTMLElement | null = document.querySelector('.product-desc');
        if (descElement) descElement.textContent = this.desc ?? '';

        const btnTmp: HTMLElement | null = document.getElementById('product-add-to-card');
        if (btnTmp) {
            if (this.app.cart?.inCart(id)) {
                btnTmp.textContent = 'In cart';
                btnTmp.style.background = '#aae0e785';
            }
            btnTmp.addEventListener('click', function () {
                if (app.cart) {
                    if (app.cart.inCart(id)) {
                        app.cart.delProduct(id);
                        this.textContent = 'Add to cart';
                        this.style.background = '#efefef';
                    } else {
                        app.cart.addProduct(id);
                        this.textContent = 'In cart';
                        this.style.background = '#aae0e785';
                    }
                }
            });
        }
        const numProducts: HTMLElement | null = document.querySelector('.num__products');
        if (numProducts) numProducts.style.display = 'none';
    }
}

export default ProductDetail;
