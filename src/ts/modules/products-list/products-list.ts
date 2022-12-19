import './products-list.scss';

import { products } from '../../../assets/data/products';
import { IProduct } from '../../types/product';
import { Routes } from '../routes/routes';

class ProductsList {
    data: Array<IProduct>;
    categories: string[] = [];
    brands: string[] = [];
    weightMin = 10000;
    weightMax = 0;
    priceMin = 10000;
    priceMax = 0;
    productInPage = 20;
    sortOder = 'none'; //SortOder = 'none';

    constructor(route: Routes) {
        products.forEach((item: IProduct) => {
            // формируем категории, бренды, цены
            if (this.categories.indexOf(item.category) < 0) this.categories.push(item.category);
            if (this.brands.indexOf(item.brand) < 0) this.brands.push(item.brand);
            if (this.priceMin > item.price) this.priceMin = item.price;
            if (this.priceMax < item.price) this.priceMax = item.price;
            if (this.weightMin > item.weight) this.weightMin = item.weight;
            if (this.weightMax < item.weight) this.weightMax = item.weight;
        });
        // формируем массив товаров по условиям
        this.data = this.formData(route);
    }

    formData(route: Routes) {
        let newProduct: Array<IProduct>;
        newProduct = products;
        if (route.sort == 'none') newProduct = products.sort(this.idUp);
        if (route.sort == 'wup') newProduct = products.sort(this.weightUp);
        if (route.sort == 'wdown') newProduct = products.sort(this.weightDown);
        if (route.sort == 'pup') newProduct = products.sort(this.priceUp);
        if (route.sort == 'pdown') newProduct = products.sort(this.priceDown);
        if (route.cats.length > 0) {
            newProduct = newProduct.filter((item) => this.filterCat(item, route.cats));
        }
        if (route.brands.length > 0) {
            newProduct = newProduct.filter((item) => this.filterBrand(item, route.brands));
        }

        if (route.page >= 0)
            return newProduct.slice(route.page * this.productInPage, (route.page + 1) * this.productInPage);
        console.log(this.sortOder, newProduct[0]);
        return newProduct;
    }

    setSortOder(sort: string, route: Routes) {
        this.sortOder = sort;
        console.log(this.sortOder);
        this.data = this.formData(route);
        this.draw();
    }

    filterCat(item: IProduct, arr: number[]) {
        const pos = this.categories.indexOf(item.category);
        if (arr.indexOf(pos) >= 0) return true;
        return false;
    }
    filterBrand(item: IProduct, arr: number[]) {
        const pos = this.brands.indexOf(item.brand);
        if (arr.indexOf(pos) >= 0) return true;
        return false;
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
    idUp(a: IProduct, b: IProduct) {
        return a.id > b.id ? 1 : -1;
    }
    draw(): void {
        let fragment: DocumentFragment | null = null;
        fragment = document.createDocumentFragment() as DocumentFragment;
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
            weightElement.textContent = (item.weight ?? '').toString() + ' kg';

            const brandElement = productsClone.querySelector('.products__item-brand') as HTMLElement;
            brandElement.textContent = item.brand ?? '';

            const btnAddToCart = productsClone.querySelector('.products__item-add-to-card') as HTMLButtonElement;
            btnAddToCart.dataset.id = item.id.toString();

            const btnDetails = productsClone.querySelector('.products__item-details') as HTMLButtonElement;
            btnDetails.dataset.id = item.id.toString();

            if (fragment) fragment.append(productsClone);
        });

        let tmp: Element | null = null;
        tmp = document.getElementById('products');
        if (tmp !== null) {
            tmp.innerHTML = '';
            // alert(fragment);
            tmp.appendChild(fragment);
        }
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
