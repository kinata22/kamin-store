import './product-details.scss';

import { products } from '../../../assets/data/products';
//import { IProduct, IParent } from '../../types/product';
//import { Routes } from '../routes/routes';

class ProductDetail {
    //data: IProduct;
    id: number;
    name: string;
    price: number;
    category: string;
    weight: number;
    brand: string;
    img: string[];
    desc?: string;

    constructor(id: number) {
        this.id = id;
        const data = products.filter((x) => (x.id = this.id))[0];
        this.name = data.name;
        this.price = data.price;
        this.category = data.category;
        this.weight = data.weight;
        this.brand = data.brand;
        this.img = data.img;
        console.log(data);
    }

    drawDetails() {
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

            div.appendChild(image);
            imagesContainer?.appendChild(div);
        });

        const priceFormatted = `$${this.price.toString()}`;
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
    }
}

export default ProductDetail;
