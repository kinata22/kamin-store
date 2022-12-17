import './products-list.scss';

import { products } from '../../../assets/data/products';
import { IProduct } from '../../types/product';

class ProductsList {
    data: Array<IProduct>;
    categories: string[] = [];
    brands: string[] = [];
    weightMin = 10000;
    weightMax = 0;
    priceMin = 10000;
    priceMax = 0;

    constructor() {
        this.data = products;
        this.data.forEach((item: IProduct) => {
            if (this.categories.indexOf(item.category) < 0) this.categories.push(item.category);
            if (this.brands.indexOf(item.brand) < 0) this.brands.push(item.brand);
            if (this.priceMin > item.price) this.priceMin = item.price;
            if (this.priceMax < item.price) this.priceMax = item.price;
            if (this.weightMin > item.weight) this.weightMin = item.weight;
            if (this.weightMax < item.weight) this.weightMax = item.weight;
        });
    }

    draw(): void {
        const fragment = document.createDocumentFragment() as DocumentFragment;
        const productsItemTemp = document.querySelector('#productsItemTemp') as HTMLTemplateElement;

        this.data.forEach((item: IProduct, idx: number) => {
            console.log(idx, item);

            const productsClone = productsItemTemp.content.cloneNode(true) as HTMLElement;

            const imageSrc = `./images/${item.img[0]}`;
            (productsClone.querySelector('.products__item-image') as HTMLImageElement).src = imageSrc;

            (productsClone.querySelector('.products__item-name') as HTMLElement).textContent = item.name;
            (productsClone.querySelector('.products__item-price') as HTMLElement).textContent = item.price.toString();
            (productsClone.querySelector('.products__item-id') as HTMLElement).textContent = item.id.toString();
            (productsClone.querySelector('.products__item-category') as HTMLElement).textContent = item.category;

            const weightElement = productsClone.querySelector('.products__item-weight') as HTMLElement;
            weightElement.textContent = (item.weight ?? '').toString();

            const brandElement = productsClone.querySelector('.products__item-brand') as HTMLElement;
            brandElement.textContent = item.brand ?? '';

            fragment.append(productsClone);
        });

        (document.querySelector('.products') as HTMLDivElement).innerHTML = '';
        (document.querySelector('.products') as HTMLDivElement).appendChild(fragment);
    }

    drawSide(): void {
        const fragmentCat = document.createDocumentFragment() as DocumentFragment;
        const fragmentBrand = document.createDocumentFragment() as DocumentFragment;
        const categoryItemTemp = document.querySelector('#catsItemTemp') as HTMLTemplateElement;
        const brandItemTemp = document.querySelector('#brandsItemTemp') as HTMLTemplateElement;

        this.categories.forEach((item: string) => {
            const catClone = categoryItemTemp.content.cloneNode(true) as HTMLElement;
            (catClone.querySelector('.filters__caterogy-item') as HTMLElement).textContent = item;
            fragmentCat.append(catClone);
        });
        this.brands.forEach((item: string) => {
            const brandClone = brandItemTemp.content.cloneNode(true) as HTMLElement;
            (brandClone.querySelector('.filters__brand-item') as HTMLElement).textContent = item;
            fragmentBrand.append(brandClone);
        });
        (document.querySelector('.filters__caterogy') as HTMLDivElement).innerHTML = '';
        (document.querySelector('.filters__caterogy') as HTMLDivElement).appendChild(fragmentCat);
        (document.querySelector('.filters__brand') as HTMLDivElement).innerHTML = '';
        (document.querySelector('.filters__brand') as HTMLDivElement).appendChild(fragmentBrand);
    }
}

export default ProductsList;
