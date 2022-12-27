import './products-list.scss';

import { products } from '../../../assets/data/products';
import { IProduct, IParent } from '../../types/product';
import { Routes } from '../routes/routes';

class ProductsList {
    data: Array<IProduct>;
    categories: string[] = []; // список категорий
    categoriesN: number[] = []; // общее кол-во товаров в категории
    categoriesNCur: number[] = []; // кол-во товаров в категории при текущих условиях
    brands: string[] = []; // список брендов
    brandsN: number[] = []; // общее кол-во товаров бренда
    brandsNCur: number[] = []; // кол-во товаров бренда при тек условиях
    productInPage = 20;
    sortOder = 'none';
    pages = 0;
    currentPage = 0;
    route: Routes;
    // переменные типа отображения товара
    view = 'plitka1';
    b_view_1: HTMLElement | null;
    b_view_2: HTMLElement | null;
    // переменные бегунков
    priceSlider: HTMLElement | null;
    weightSlider: HTMLElement | null;
    priceMinE: HTMLElement | null;
    priceMaxE: HTMLElement | null;
    priceRange: HTMLElement | null;
    weightMinE: HTMLElement | null;
    weightMaxE: HTMLElement | null;
    weightRange: HTMLElement | null;
    weightMin = 10000;
    weightMax = 0;
    priceMin = 10000;
    priceMax = 0;
    priceMinCur = 0;
    priceMaxCur = 0;
    weightMinCur = 0;
    weightMaxCur = 0;

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
        });
        // рисуем кнопочки переключения вида и запускаем отслеживание у них событий
        this.view = route.view;
        this.b_view_1 = document.getElementById('plitka1');
        this.b_view_2 = document.getElementById('plitka2');
        if (this.b_view_1 !== null && this.b_view_2 !== null) {
            const obj = this;
            this.b_view_1.addEventListener('click', function () {
                route.setView('plitka1');
                obj.setView('plitka1');
            });
            this.b_view_2.addEventListener('click', function () {
                route.setView('plitka2');
                obj.setView('plitka2');
            });
            this.viewSetBorder(route.view);
        }
        // запоминаем элементы слайдеров
        this.priceSlider = document.getElementById('priceSlider');
        this.weightSlider = document.getElementById('weightSlider');
        this.priceMinE = document.getElementById('priceMin');
        this.priceMaxE = document.getElementById('priceMax');
        this.priceRange = document.getElementById('priceRange');
        this.weightMinE = document.getElementById('weightMin');
        this.weightMaxE = document.getElementById('weightMax');
        this.weightRange = document.getElementById('weightRange');
        this.priceMinE = document.getElementById('priceMin');
        this.priceMaxE = document.getElementById('priceMax');
        this.priceRange = document.getElementById('priceRange');
        this.weightMinE = document.getElementById('weightMin');
        this.weightMaxE = document.getElementById('weightMax');
        this.weightRange = document.getElementById('weightRange');

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

        // интервал цены и веса
        if (newProduct.length > 0) {
            this.priceMin = newProduct[0].price;
            this.priceMax = newProduct[0].price;
            this.weightMin = newProduct[0].weight;
            this.weightMax = newProduct[0].weight;
        } else {
            this.priceMin = 0;
            this.priceMax = 0;
            this.weightMin = 0;
            this.weightMax = 0;
        }
        // берем мин и макс и категории для текущего набора
        newProduct.forEach((item: IProduct) => {
            if (this.priceMin > item.price) this.priceMin = item.price;
            if (this.priceMax < item.price) this.priceMax = item.price;
            if (this.weightMin > item.weight) this.weightMin = item.weight;
            if (this.weightMax < item.weight) this.weightMax = item.weight;
            let n = this.categories.indexOf(item.category);
            this.categoriesNCur[n] += 1;
            n = this.brands.indexOf(item.brand);
            this.brandsNCur[n] += 1;
        });

        this.getBegunokCurVal();
        if (this.priceMaxCur === 0) this.priceMaxCur = this.priceMax;
        if (this.weightMaxCur === 0) this.weightMaxCur = this.weightMax;
        console.log(newProduct.length, this.priceMinCur, this.priceMaxCur, this.weightMinCur, this.weightMaxCur);
        newProduct = newProduct.filter((item) =>
            this.filterPriceWeight(
                item,
                Math.max(this.priceMin, this.priceMinCur),
                Math.min(this.priceMax, this.priceMaxCur),
                Math.max(this.weightMin, this.weightMinCur),
                Math.min(this.weightMax, this.weightMaxCur)
            )
        );
        console.log(newProduct.length);
        this.pages = Math.ceil(newProduct.length / this.productInPage);
        this.currentPage = route.page;
        if (this.currentPage > this.pages) {
            this.currentPage = 0;
            route.page = 0;
        }
        if (route.page >= 0)
            return newProduct.slice(route.page * this.productInPage, (route.page + 1) * this.productInPage);
        return newProduct;
    }

    viewSetBorder(view: string) {
        // рисуем рамки вокруг типа обзора
        if (this.b_view_1 !== null && this.b_view_2 !== null) {
            if (view === 'plitka1') {
                this.b_view_1.style.border = '1px solid gray';
                this.b_view_2.style.border = '0px';
            } else {
                this.b_view_2.style.border = '1px solid gray';
                this.b_view_1.style.border = '0px';
            }
        }
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
    filterPriceWeight(item: IProduct, priceMin: number, priceMax: number, weightMin: number, weightMax: number) {
        /* функция используется в фильтре товаров по весу и цене */
        if (item.weight >= weightMin && item.weight <= weightMax && item.price >= priceMin && item.price <= priceMax)
            return true;
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
                obj.moveBegunokToStart();
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
    setView(view: string): void {
        this.view = view;
        this.draw();
    }

    draw(): void {
        console.log('len', this.data.length);
        if (this.data.length <= 0) {
            const tmp = document.getElementById('products');
            if (tmp !== null) {
                tmp.innerHTML = ` <h2> We didn't find products for your conditions </h2>`;
            }
            return;
        }
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

        // доавляем класс вывода товара если краткий тип отображения и рисуем рамку вокруг выбранного типа
        let tmp: Element | null = null;
        tmp = document.getElementById('products');
        if (tmp !== null) {
            tmp.innerHTML = '';
            tmp.appendChild(fragment);

            if (this.view === 'plitka2') {
                const tmp1 = document.getElementsByClassName('products__item');
                for (let i = 0; i < tmp1.length; i++) {
                    const tmp2 = tmp1[i];
                    tmp2.classList.add('products__item-view2');
                }
            }
        }
        this.viewSetBorder(this.view);

        // отображаем макс и мин бегунков
        tmp = document.getElementById('nPriceMin');
        if (tmp !== null) tmp.innerHTML = String(this.priceMin);
        tmp = document.getElementById('nPriceMax');
        if (tmp !== null) tmp.innerHTML = String(this.priceMax);
        tmp = document.getElementById('nWeightMin');
        if (tmp !== null) tmp.innerHTML = String(this.weightMin);
        tmp = document.getElementById('nWeightMax');
        if (tmp !== null) tmp.innerHTML = String(this.weightMax);
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
            });

            pagination?.appendChild(btn);
        }
    }

    moveRange(elem: HTMLElement) {
        /*Находим нужный элемент по классу или id*/
        const coords = getCoords(elem);
        let slider = 'weight';
        if (elem.id === 'priceMin' || elem.id === 'priceMax') slider = 'price';
        /*Определяем родителя*/
        const tmp = elem.parentElement;
        if (tmp === null) return;
        const parent: IParent = {
            element: tmp,
            coords: getCoords(tmp),
        };
        /*Определяем зону окрашывания*/
        const colorRange = parent.element.children[1] as HTMLElement;
        let f: number; //устанавливаем флаг для определения мин или макс элемента
        let value: string; //значение фильтра
        /*Определяем второй ползунок и родителя*/
        let block2: IParent;
        if (elem.classList.contains('block-min')) {
            block2 = {
                element: parent.element.children[2] as HTMLElement,
                coords: getCoords(parent.element.children[2] as HTMLElement),
            };
            f = 0; // min
        } else {
            block2 = {
                element: parent.element.children[0] as HTMLElement,
                coords: getCoords(parent.element.children[0] as HTMLElement),
            };
            f = 1; // max
        }
        /*Делаем индикатор над ползунком*/
        const indicator = document.createElement('div');
        if (elem.children.length) {
            elem.innerHTML = ''; //обнуляем предыдущее значение
        }
        elem.appendChild(indicator);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        // document.addEventListener('touchmove', onMouseMove);
        document.addEventListener('touchend', onMouseUp);
        /*выключаем браузерное событие DaD*/
        elem.ondragstart = function () {
            return false;
        };
        const obj = this;
        function onMouseMove(e: MouseEvent) {
            /*Определяем смещение влево*/
            e.preventDefault(); //предотвратить запуск выделения элементов
            /*Определяем положение мыши в зависимости от устройства*/
            /*На мобильных устройствах может фиксироваться несколько точек касания, поэтому используется массив targetTouches*/
            /*Мы будем брать только первое зафиксированое касание по экрану targetTouches[0]*/
            //let pos: number;
            //if (e.touches === undefined) {
            const pos = e.clientX;
            /* } else {
                pos = e.targetTouches[0].clientX;
            }*/
            /*Устанавливаем границы движения ползунка*/
            let newLeft = pos - parent.coords.leftX;
            const rigthEdge = parent.coords.width - (coords.width + 1);

            if (newLeft < 0) {
                newLeft = 0;
            } else if (newLeft > rigthEdge) {
                newLeft = rigthEdge;
            }
            if (f === 0 && pos > block2.coords.left - block2.coords.width) {
                newLeft = block2.coords.left - block2.coords.width - 5 - parent.coords.leftX;
                console.log('newLeft', newLeft);
            } else if (f === 1 && pos < block2.coords.rigth + 5) {
                newLeft = block2.coords.rigth + 5 - parent.coords.leftX;
                console.log('newLeft2', newLeft);
            }
            /*устанавливаем отступ нашему элементу*/
            elem.style.left = newLeft + 'px';

            //     Определяем значение фильтра
            let rangeMin: number;
            let rangeMax: number;
            const tmpMinP = document.getElementById('nPriceMin');
            const tmpMaxP = document.getElementById('nPriceMax');
            const tmpMinW = document.getElementById('nWeightMin');
            const tmpMaxW = document.getElementById('nWeightMax');
            if (tmpMinP !== null && tmpMaxP !== null && tmpMinW !== null && tmpMaxW !== null) {
                rangeMin = +tmpMinP.innerHTML;
                rangeMax = +tmpMaxP.innerHTML;
                if (slider === 'weight') {
                    rangeMin = +tmpMinW.innerHTML;
                    rangeMax = +tmpMaxW.innerHTML;
                }
                if (f === 0) {
                    value = (newLeft / (parent.coords.width / (rangeMax - rangeMin)) + rangeMin).toFixed(1);
                } else {
                    value = (newLeft / (parent.coords.width / (rangeMax - rangeMin)) + 0.3 + rangeMin).toFixed(1);
                }
            }
            /*Выводим значение над ползунком*/
            indicator.style.position = 'absolute';
            indicator.style.fontSize = '11px';
            indicator.style.left = -coords.width / 2 + 'px';
            indicator.style.color = '#861806';
            indicator.style.top = parseFloat(window.getComputedStyle(elem).getPropertyValue('top')) - 18 + 'px';
            /*Для красоты слайдера уберем вывод значений в начальной и конечной точках*/
            if (newLeft <= 0) {
                indicator.innerHTML = '';
            } else if (newLeft >= rigthEdge) {
                indicator.innerHTML = '';
            } else {
                indicator.innerHTML = value;
            }

            /*Делаем цветную плашечку диапазона выбора*/
            if (f == 0) {
                colorRange.style.left = newLeft + coords.width + 'px';
                colorRange.style.width = block2.coords.left - getCoords(elem).left - coords.width + 'px';
            } else {
                colorRange.style.left = block2.coords.left - parent.coords.leftX + 'px';
                colorRange.style.width = getCoords(elem).left - block2.coords.left + 'px';
            }
            obj.getBegunokCurVal();
        }

        function onMouseUp() {
            console.log('hi');
            obj.data = obj.formData();
            obj.draw();
            obj.drawPages();
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('touchend', onMouseUp);
            //document.removeEventListener('touchmove', onMouseMove);
        }
    }
    moveBegunokToStart() {
        let tmp = document.getElementById('priceMin');
        if (tmp) {
            tmp.style.left = '0';
            tmp.innerHTML = '';
        }
        tmp = document.getElementById('priceMax');
        if (tmp) {
            tmp.style.left = '97%';
            tmp.innerHTML = '';
        }
        tmp = document.getElementById('weightMin');
        if (tmp) {
            tmp.style.left = '0';
            tmp.innerHTML = '';
        }
        tmp = document.getElementById('weightMax');
        if (tmp) {
            tmp.style.left = '97%';
            tmp.innerHTML = '';
        }
        tmp = this.weightRange;
        if (tmp) {
            tmp.style.left = '15px';
            tmp.style.width = '97%';
        }
        tmp = this.priceRange;
        if (tmp) {
            tmp.style.left = '15px';
            tmp.style.width = '97%';
        }
        this.priceMinCur = 0;
        this.priceMaxCur = 0;
        this.weightMinCur = 0;
        this.weightMaxCur = 0;
    }
    getBegunokCurVal() {
        let tmp: HTMLElement | null;
        if (this.priceMinE !== null) {
            const tmp = this.priceMinE.getElementsByTagName('div')[0];
            if (tmp !== null && tmp !== undefined) this.priceMinCur = +tmp.innerHTML;
        }
        if (this.priceMaxE !== null) {
            tmp = this.priceMaxE.getElementsByTagName('div')[0];
            if (tmp !== null && tmp !== undefined) this.priceMaxCur = +tmp.innerHTML;
        }
        if (this.weightMinE !== null) {
            tmp = this.weightMinE.getElementsByTagName('div')[0];
            if (tmp !== null && tmp !== undefined) this.weightMinCur = +tmp.innerHTML;
        }
        if (this.weightMaxE !== null) {
            const tmp = this.weightMaxE.getElementsByTagName('div')[0];
            if (tmp !== null && tmp !== undefined) this.weightMaxCur = +tmp.innerHTML;
        }
    }
}

function getCoords(elem: HTMLElement) {
    /*Получаем координаты относительно окна браузера*/
    const coords = elem.getBoundingClientRect();
    /*Высчитываем значения координат относительно документа, вычисляя прокрутку документа*/
    return {
        top: coords.top + window.pageYOffset,
        left: coords.left + window.pageXOffset,
        leftX: coords.left,
        rigth: coords.left + window.pageXOffset + coords.width,
        bottom: coords.top + window.pageYOffset + coords.height,
        width: coords.width,
    };
}

export default ProductsList;
