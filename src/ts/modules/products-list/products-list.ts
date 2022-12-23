import './products-list.scss';

import { products } from '../../../assets/data/products';
import { IProduct } from '../../types/product';
import { Routes } from '../routes/routes';

class ProductsList {
    data: Array<IProduct>;
    categories: string[] = []; // список категорий
    categoriesN: number[] = []; // общее кол-во товаров в категории
    categoriesNCur: number[] = []; // кол-во товаров в категории при текущих условиях
    brands: string[] = []; // список брендов
    brandsN: number[] = []; // общее кол-во товаров бренда
    brandsNCur: number[] = []; // кол-во товаров бренда при тек условиях
    weightMin = 10000;
    weightMax = 0;
    priceMin = 10000;
    priceMax = 0;
    productInPage = 20;
    sortOder = 'none';
    pages = 0;
    currentPage = 0;
    route: Routes;

    constructor(route: Routes) {
        this.route = route;
        products.forEach((item: IProduct) => {
            // формируем категории, бренды, цены
            let n = this.categories.indexOf(item.category);
            if (n < 0) {
                this.categories.push(item.category);
                this.categoriesN.push(1);
            } else this.categoriesN[n] += 1;
            n = this.brands.indexOf(item.brand);
            if (n < 0) {
                this.brands.push(item.brand);
                this.brandsN.push(1);
            } else this.brandsN[n] += 1;
            this.brandsNCur.length = this.brandsN.length;
            this.categoriesNCur.length = this.categoriesN.length;
            // интервал цены и веса
            if (this.priceMin > item.price) this.priceMin = item.price;
            if (this.priceMax < item.price) this.priceMax = item.price;
            if (this.weightMin > item.weight) this.weightMin = item.weight;
            if (this.weightMax < item.weight) this.weightMax = item.weight;
        });
        // формируем массив товаров по условиям
        this.data = this.formData();
    }

    formData(): Array<IProduct> {
        let newProduct: Array<IProduct>;
        newProduct = products;
        const route = this.route;
        if (route.sort == 'none') newProduct = products.sort(this.idUp);
        if (route.sort == 'wup') newProduct = products.sort(this.weightUp);
        if (route.sort == 'wdown') newProduct = products.sort(this.weightDown);
        if (route.sort == 'pup') newProduct = products.sort(this.priceUp);
        if (route.sort == 'pdown') newProduct = products.sort(this.priceDown);
        // console.log('before filter', newProduct.length);
        if (route.cats.length > 0) {
            newProduct = newProduct.filter((item) => this.filterCat(item, route.cats));
        }
        if (route.brands.length > 0) {
            newProduct = newProduct.filter((item) => this.filterBrand(item, route.brands));
        }
        // считаем текущие значения для чекбоксов
        this.categoriesNCur.fill(0);
        this.brandsNCur.fill(0);
        newProduct.forEach((item: IProduct) => {
            let n = this.categories.indexOf(item.category);
            this.categoriesNCur[n] += 1;
            n = this.brands.indexOf(item.brand);
            this.brandsNCur[n] += 1;
        });
        this.pages = Math.floor(newProduct.length / this.productInPage);
        this.currentPage = route.page;
        if (this.currentPage > this.pages) {
            this.currentPage = 0;
            route.page = 0;
        }
        if (route.page >= 0)
            return newProduct.slice(route.page * this.productInPage, (route.page + 1) * this.productInPage);
        return newProduct;
    }

    setSortOder(sort: string): void {
        /* изменили порядок сортировки */
        this.sortOder = sort;
        this.data = this.formData();
        this.draw();
    }
    setPage(page: number): void {
        /* выбрали новую страницу */
        this.currentPage = page;
        this.data = this.formData();
        this.draw();
        this.drawPages();
    }

    filterCat(item: IProduct, arr: number[]): boolean {
        /* функция используется в фильтре товаров по выбранным категориям */
        const pos = this.categories.indexOf(item.category);
        if (arr.indexOf(pos) >= 0) return true;
        return false;
    }
    filterBrand(item: IProduct, arr: number[]): boolean {
        /* функция используется в фильтре товаров по выбранным брендам */
        const pos = this.brands.indexOf(item.brand);
        if (arr.indexOf(pos) >= 0) return true;
        return false;
    }
    weightUp(a: IProduct, b: IProduct): number {
        return a.weight > b.weight ? 1 : -1;
    }
    weightDown(a: IProduct, b: IProduct): number {
        return a.weight > b.weight ? -1 : 1;
    }
    priceUp(a: IProduct, b: IProduct): number {
        return a.price > b.price ? 1 : -1;
    }
    priceDown(a: IProduct, b: IProduct): number {
        return a.price > b.price ? -1 : 1;
    }
    idUp(a: IProduct, b: IProduct): number {
        return a.id > b.id ? 1 : -1;
    }
    draw(): void {
        const fragment: DocumentFragment | null = document.createDocumentFragment();
        const productsItemTemp: HTMLTemplateElement | null = document.querySelector('#productsItemTemp');

        this.data.forEach((item: IProduct /*, idx: number*/) => {
            //console.log(idx, item);

            const productsClone: HTMLElement | undefined = <HTMLElement>productsItemTemp?.content.cloneNode(true);

            const imageSrc = `./images/${item.img[0]}`;

            const htmlItemImage: HTMLImageElement | null = productsClone.querySelector('.products__item-image');
            if (htmlItemImage) htmlItemImage.src = imageSrc;

            const htmlItemName: HTMLImageElement | null = productsClone.querySelector('.products__item-name');
            if (htmlItemName) htmlItemName.textContent = item.name;

            const priceFormatted = `$${item.price.toString()}`;

            const htmlItemPrice: HTMLImageElement | null = productsClone.querySelector('.products__item-price');
            if (htmlItemPrice) htmlItemPrice.textContent = priceFormatted;

            const htmlItemId: HTMLImageElement | null = productsClone.querySelector('.products__item-id');
            if (htmlItemId) htmlItemId.textContent = item.id.toString();

            const htmlItemCategory: HTMLImageElement | null = productsClone.querySelector('.products__item-category');
            if (htmlItemCategory) htmlItemCategory.textContent = item.category;

            const weightElement: HTMLElement | null = productsClone.querySelector('.products__item-weight');
            if (weightElement) weightElement.textContent = (item.weight ?? '').toString() + ' kg';

            const brandElement: HTMLElement | null = productsClone.querySelector('.products__item-brand');
            if (brandElement) brandElement.textContent = item.brand ?? '';

            const btnAddToCart: HTMLButtonElement | null = productsClone.querySelector('.products__item-add-to-card');
            if (btnAddToCart) btnAddToCart.dataset.id = item.id.toString();

            const btnDetails: HTMLButtonElement | null = productsClone.querySelector('.products__item-details');
            if (btnDetails) btnDetails.dataset.id = item.id.toString();

            if (fragment) fragment.append(productsClone);
        });

        let tmp: Element | null = null;
        tmp = document.getElementById('products');
        if (tmp !== null) {
            tmp.innerHTML = '';
            tmp.appendChild(fragment);
        }
    }

    setCheckbox(cloneElem: HTMLElement, title: string, idx: number, type: string): HTMLElement {
        const checkbox: HTMLInputElement | null = cloneElem.querySelector(`.${type}__checkbox`);
        const checkboxId = type + idx.toString();
        if (checkbox) checkbox.id = checkboxId;
        const label: HTMLLabelElement | null = cloneElem.querySelector(`.${type}__label`);
        if (label) {
            label.htmlFor = checkboxId;
            label.textContent = title;
        }
        //
        const num: HTMLSpanElement | null = cloneElem.querySelector(`.${type}__num`);
        if (num) {
            if (type == 'brand')
                num.innerHTML = ' (' + String(this.brandsN[idx]) + ' / ' + String(this.brandsN[idx]) + ') ';
            else num.innerHTML = ' (' + String(this.categoriesN[idx]) + ' / ' + String(this.categoriesN[idx]) + ') ';
        }
        //
        const obj = this;
        if (checkbox) {
            if (type === 'category') if (obj.route.cats.indexOf(idx) !== -1) checkbox.checked = true;
            if (type === 'brand') if (obj.route.brands.indexOf(idx) !== -1) checkbox.checked = true;
            //
            checkbox.addEventListener('click', function () {
                obj.route.setCheckBox(idx, type, this.checked);
                obj.data = obj.formData();
                obj.setCheckboxValues();
                obj.draw();
                obj.drawPages();
            });
        }
        return cloneElem;
    }
    setCheckboxValues(): void {
        /* вывод значений после фильтра около рубрик и брендов */
        let elems = document.getElementsByClassName('brand__num');
        let i = 0;
        for (const elem of elems) {
            elem.innerHTML = ' (' + String(this.brandsN[i]) + ' / ' + String(this.brandsNCur[i]) + ') ';
            i += 1;
        }
        elems = document.getElementsByClassName('category__num');
        i = 0;
        for (const elem of elems) {
            elem.innerHTML = ' (' + String(this.categoriesN[i]) + ' / ' + String(this.categoriesNCur[i]) + ') ';
            i += 1;
        }
    }

    drawSide(): void {
        const fragmentCat: DocumentFragment | null = document.createDocumentFragment();
        const fragmentBrand: DocumentFragment | null = document.createDocumentFragment();
        const categoryItemTemp: HTMLTemplateElement | null = document.querySelector('#catsItemTemp');
        const brandItemTemp: HTMLTemplateElement | null = document.querySelector('#brandsItemTemp');

        if (categoryItemTemp) {
            this.categories.forEach((item: string, idx: number) => {
                const catClone = categoryItemTemp.content.cloneNode(true) as HTMLElement;
                fragmentCat.append(this.setCheckbox(catClone, item, idx, 'category'));
            });
        }
        if (brandItemTemp) {
            this.brands.forEach((item: string, idx: number) => {
                const brandClone = brandItemTemp.content.cloneNode(true) as HTMLElement;
                //(brandClone.querySelector('.filters__brand-item') as HTMLElement).textContent = item;
                fragmentBrand.append(this.setCheckbox(brandClone, item, idx, 'brand'));
            });
        }

        const filtersCategoryElem: HTMLDivElement | null = document.querySelector('.filters__category');
        if (filtersCategoryElem) {
            filtersCategoryElem.innerHTML = '';
            filtersCategoryElem.appendChild(fragmentCat);
        }

        const filtersBrandElem: HTMLDivElement | null = document.querySelector('.filters__brand');
        if (filtersBrandElem) {
            filtersBrandElem.innerHTML = '';
            filtersBrandElem.appendChild(fragmentBrand);
        }
    }

    drawPages(): void {
        const pagination: HTMLDivElement | null = document.querySelector('#pagination');
        if (pagination === null) return;
        pagination.innerHTML = '';
        for (let i = 0; i < this.pages; i++) {
            const btn: HTMLButtonElement = document.createElement('button');
            btn.className = 'b-page';
            if (i === this.currentPage) {
                btn.classList.add('active');
            }
            btn.innerHTML = (i + 1).toString();
            const obj = this;

            btn.addEventListener('click', function () {
                obj.route.setPage(i);
                obj.setPage(i);
                // setPage(numPage, route);
                console.log(i.toString());
            });

            pagination?.appendChild(btn);
        }
    }
}

export default ProductsList;
