import './products-list.scss';

import { products } from '../../../assets/data/products';
import { IProduct } from '../../types/product';
import { Routes, SortOder } from '../routes/routes';

class ProductsList {
    data: Array<IProduct>;
    categories: string[] = [];
    brands: string[] = [];
    weightMin = 10000;
    weightMax = 0;
    priceMin = 10000;
    priceMax = 0;
    productInPage = 20;
    sortOder: SortOder = 'none';

    constructor(route: Routes) {
        if (route.sort == 'wup') products.sort(this.weightUp);
        if (route.sort == 'wdown') products.sort(this.weightDown);
        if (route.sort == 'pup') products.sort(this.priceUp);
        if (route.sort == 'pdown') products.sort(this.priceDown);
        if (route.page >= 0)
            this.data = products.slice(route.page * this.productInPage, (route.page + 1) * this.productInPage);
        else this.data = products;
        products.forEach((item: IProduct) => {
            if (this.categories.indexOf(item.category) < 0) this.categories.push(item.category);
            if (this.brands.indexOf(item.brand) < 0) this.brands.push(item.brand);
            if (this.priceMin > item.price) this.priceMin = item.price;
            if (this.priceMax < item.price) this.priceMax = item.price;
            if (this.weightMin > item.weight) this.weightMin = item.weight;
            if (this.weightMax < item.weight) this.weightMax = item.weight;
        });
    }

    weightUp(a: IProduct, b: IProduct) {
        return a.weight > b.weight ? 1 : -1;
    }
    weightDown(a: IProduct, b: IProduct) {
        return a.weight > b.weight ? -1 : 1;
    }
    priceUp(a: IProduct, b: IProduct) {
        return a.price > b.price ? 1 : -1;
    }
    priceDown(a: IProduct, b: IProduct) {
        return a.price > b.price ? -1 : 1;
    }

    draw(): void {
        const fragment = document.createDocumentFragment() as DocumentFragment;
        const productsItemTemp = document.querySelector('#productsItemTemp') as HTMLTemplateElement;

        this.data.forEach((item: IProduct /*, idx: number*/) => {
            //console.log(idx, item);

            const productsClone = productsItemTemp.content.cloneNode(true) as HTMLElement;

            const imageSrc = `./images/${item.img[0]}`;
            (productsClone.querySelector('.products__item-image') as HTMLImageElement).src = imageSrc;

            (productsClone.querySelector('.products__item-name') as HTMLElement).textContent = item.name;

            const priceFormatted = `$${item.price.toString()}`;
            (productsClone.querySelector('.products__item-price') as HTMLElement).textContent = priceFormatted;

            (productsClone.querySelector('.products__item-id') as HTMLElement).textContent = item.id.toString();

            (productsClone.querySelector('.products__item-category') as HTMLElement).textContent = item.category;

            const weightElement = productsClone.querySelector('.products__item-weight') as HTMLElement;
            weightElement.textContent = (item.weight ?? '').toString();

            const brandElement = productsClone.querySelector('.products__item-brand') as HTMLElement;
            brandElement.textContent = item.brand ?? '';

            const btnAddToCart = productsClone.querySelector('.products__item-add-to-card') as HTMLButtonElement;
            btnAddToCart.dataset.id = item.id.toString();

            const btnDetails = productsClone.querySelector('.products__item-details') as HTMLButtonElement;
            btnDetails.dataset.id = item.id.toString();

            fragment.append(productsClone);
        });

        (document.querySelector('.products') as HTMLDivElement).innerHTML = '';
        (document.querySelector('.products') as HTMLDivElement).appendChild(fragment);
    }

    setCheckbox(cloneElem: HTMLElement, title: string, idx: number, type: string): HTMLElement {
        const checkbox = cloneElem.querySelector(`.${type}__checkbox`) as HTMLInputElement;
        const checkboxId = type + idx.toString();
        checkbox.id = checkboxId;
        const label = cloneElem.querySelector(`.${type}__label`) as HTMLLabelElement;
        label.htmlFor = checkboxId;
        label.textContent = title;
        return cloneElem;
    }

    drawSide(): void {
        const fragmentCat = document.createDocumentFragment() as DocumentFragment;
        const fragmentBrand = document.createDocumentFragment() as DocumentFragment;
        const categoryItemTemp = document.querySelector('#catsItemTemp') as HTMLTemplateElement;
        const brandItemTemp = document.querySelector('#brandsItemTemp') as HTMLTemplateElement;

        this.categories.forEach((item: string, idx: number) => {
            const catClone = categoryItemTemp.content.cloneNode(true) as HTMLElement;
            fragmentCat.append(this.setCheckbox(catClone, item, idx, 'category'));
        });
        this.brands.forEach((item: string, idx: number) => {
            const brandClone = brandItemTemp.content.cloneNode(true) as HTMLElement;
            //(brandClone.querySelector('.filters__brand-item') as HTMLElement).textContent = item;
            fragmentBrand.append(this.setCheckbox(brandClone, item, idx, 'brand'));
        });
        (document.querySelector('.filters__category') as HTMLDivElement).innerHTML = '';
        (document.querySelector('.filters__category') as HTMLDivElement).appendChild(fragmentCat);
        (document.querySelector('.filters__brand') as HTMLDivElement).innerHTML = '';
        (document.querySelector('.filters__brand') as HTMLDivElement).appendChild(fragmentBrand);
    }
}

export default ProductsList;
