import './products-list.scss';

import { products } from '../../../assets/data/products';
import { IProduct, IParent } from '../../types/product';
import { Routes } from '../routes/routes';
import ProductDetail from '../product-details/product-details';
import App from '../app';

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
    priceSlider: HTMLElement | null; // элементы слайдеры, вес и цена
    weightSlider: HTMLElement | null;
    priceMinE: HTMLElement | null; // элементы бегунки, 4 штуки и 2 полоски между бегунками
    priceMaxE: HTMLElement | null;
    priceRange: HTMLElement | null;
    weightMinE: HTMLElement | null;
    weightMaxE: HTMLElement | null;
    weightRange: HTMLElement | null;
    numProductsVal: HTMLElement | null; // вывод кол-ва товаров при данных условиях
    mainWeightMin: number; // граничные веса и цены для товаров без условий
    mainWeightMax: number;
    mainPriceMin: number;
    mainPriceMax: number;
    weightMin: number; // граничные веса и цены для текущего набора товаров с условиями
    weightMax: number;
    priceMin: number;
    priceMax: number;
    curPriceMin: number; // границы бегунков (они всегда внутри текущих интервалов)
    curPriceMax: number;
    curWeightMin: number;
    curWeightMax: number;

    clearAll: HTMLElement | null;
    copyUrl: HTMLElement | null;
    app: App;

    constructor(route: Routes, app: App) {
        this.route = route;
        let tmp: HTMLElement | null = document.querySelector('.page-product-list');
        if (tmp) tmp.style.display = 'flex';
        tmp = document.querySelector('.page-cart');
        if (tmp) tmp.style.display = 'none';
        tmp = document.querySelector('.page-product-detail');
        if (tmp) tmp.style.display = 'none';
        this.app = app;
        this.numProductsVal = document.querySelector('.num__products-val');
        if (this.numProductsVal) this.numProductsVal.innerHTML = '';

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

        // формируем категории, бренды, цены
        this.weightMin = products[0].weight;
        this.weightMax = products[0].weight;
        this.priceMin = products[0].price;
        this.priceMax = products[0].price;
        products.forEach((item: IProduct) => {
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
            if (this.priceMin > item.price) this.priceMin = item.price;
            if (this.priceMax < item.price) this.priceMax = item.price;
            if (this.weightMin > item.weight) this.weightMin = item.weight;
            if (this.weightMax < item.weight) this.weightMax = item.weight;
        });
        this.mainPriceMin = this.curPriceMin = this.priceMin;
        this.mainPriceMax = this.curPriceMax = this.priceMax;
        this.mainWeightMin = this.curWeightMin = this.weightMin;
        this.mainWeightMax = this.curWeightMax = this.weightMax;
        if (route.weightFrom != '') this.curWeightMin = Number(route.weightFrom);
        if (route.weightTo != '') this.curWeightMax = Number(route.weightTo);
        if (route.priceTo != '') this.curPriceMax = Number(route.priceTo);
        if (route.priceFrom != '') this.curPriceMin = Number(route.priceFrom);

        this.setBegunokPos(this.curPriceMin, this.curPriceMax, this.curWeightMin, this.curWeightMax);

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
            this.drawViewButtonBorder(route.view);
        }

        this.clearAll = document.getElementById('clearall');
        if (this.clearAll) {
            const obj = this;
            this.clearAll.addEventListener('click', function () {
                obj.clear();
            });
        }
        this.copyUrl = document.getElementById('copyurl');
        if (this.copyUrl) {
            this.copyUrl.addEventListener('click', function () {
                const tmpWrite: HTMLTextAreaElement | null = document.getElementsByTagName('textarea')[0];
                if (tmpWrite) {
                    console.log('textarea', tmpWrite, window.location.href);
                    tmpWrite.innerHTML = window.location.href;
                    tmpWrite.value = window.location.href;
                    tmpWrite.select();
                    //                    const selection = window.getSelection();
                    try {
                        if (document.execCommand('copy')) {
                            this.innerHTML = 'Copied';
                            setTimeout(() => {
                                this.innerHTML = 'Copy Link';
                            }, 1000);
                        }
                    } catch (err) {
                        console.log('Oops, unable to copy');
                    }
                }
            });
        }

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

        // фильтруем по категориям и бренду
        if (route.cats.length > 0) {
            newProduct = newProduct.filter((item) => this.filterCat(item, route.cats));
        }
        if (route.brands.length > 0) {
            newProduct = newProduct.filter((item) => this.filterBrand(item, route.brands));
        }

        // интервал цены и веса
        this.priceMin = this.mainPriceMax;
        this.priceMax = this.mainPriceMin;
        this.weightMin = this.mainWeightMax;
        this.weightMax = this.mainWeightMin;

        // берем мин и макс веса для текущего набора
        newProduct.forEach((item: IProduct) => {
            if (this.priceMin > item.price) this.priceMin = item.price;
            if (this.priceMax < item.price) this.priceMax = item.price;
            if (this.weightMin > item.weight) this.weightMin = item.weight;
            if (this.weightMax < item.weight) this.weightMax = item.weight;
        });

        // фильтруем по цене и весу
        this.getBegunokCurVal();

        if (this.curPriceMax === 0) this.curPriceMax = this.priceMax;
        if (this.curWeightMax === 0) this.curWeightMax = this.weightMax;
        newProduct = newProduct.filter((item) =>
            this.filterPriceWeight(
                item,
                Math.max(this.priceMin, this.curPriceMin),
                Math.min(this.priceMax, this.curPriceMax),
                Math.max(this.weightMin, this.curWeightMin),
                Math.min(this.weightMax, this.curWeightMax)
            )
        );

        // считаем текущие кол-ва товаров рядом с чекбоксами
        this.categoriesNCur.fill(0);
        this.brandsNCur.fill(0);
        newProduct.forEach((item: IProduct) => {
            let n = this.categories.indexOf(item.category);
            this.categoriesNCur[n] += 1;
            n = this.brands.indexOf(item.brand);
            this.brandsNCur[n] += 1;
        });

        this.pages = Math.ceil(newProduct.length / this.productInPage);
        this.currentPage = route.page;
        if (this.currentPage > this.pages) {
            this.currentPage = 0;
            route.page = 0;
        }
        if (this.numProductsVal) this.numProductsVal.innerHTML = String(newProduct.length);

        if (route.page >= 0)
            return newProduct.slice(route.page * this.productInPage, (route.page + 1) * this.productInPage);
        return newProduct;
    }

    // --------------------------- фильтры ------------------------
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

    // ------------------------ сортировки -------------------------
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

    // ------------------- клики по кнопкам (страница новая, сортировка) -------------------
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
    setView(view: string): void {
        this.view = view;
        this.draw();
    }

    // -------------------  отрисовки --------------------------
    drawCheckbox(cloneElem: HTMLElement, title: string, idx: number, type: string): HTMLElement {
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
                obj.drawCheckboxValues();
                obj.draw();
                obj.drawPages();
            });
        }
        return cloneElem;
    }

    drawCheckboxValues(): void {
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

    draw(): void {
        console.log('len55', this.data.length);
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
            const htmlItemLink: HTMLAnchorElement | null = productsClone.querySelector('.products__item-link');
            if (htmlItemLink) htmlItemLink.href = `index.html?product=${item.id}`;

            const htmlItemName: HTMLAnchorElement | null = productsClone.querySelector('.products__item-name');
            if (htmlItemName) {
                htmlItemName.textContent = item.name;
                htmlItemName.href = `index.html?product=${item.id}`;
            }

            const priceFormatted = ` €${item.price.toString()}`;

            const htmlItemPrice: HTMLElement | null = productsClone.querySelector('.products__item-price');
            if (htmlItemPrice) htmlItemPrice.textContent = priceFormatted;
            const htmlItemId: HTMLElement | null = productsClone.querySelector('.products__item-id');
            if (htmlItemId) htmlItemId.textContent = item.id.toString();
            const htmlItemCategory: HTMLElement | null = productsClone.querySelector('.products__item-category');
            if (htmlItemCategory) htmlItemCategory.textContent = item.category;
            const weightElement: HTMLElement | null = productsClone.querySelector('.products__item-weight');
            if (weightElement) weightElement.textContent = (item.weight ?? '').toString() + ' kg';
            const brandElement: HTMLElement | null = productsClone.querySelector('.products__item-brand');
            if (brandElement) brandElement.textContent = item.brand ?? '';
            const stockElement: HTMLElement | null = productsClone.querySelector('.products__item-stock');
            if (stockElement) stockElement.textContent = item.quantity.toString();

            const btnAddToCart: HTMLButtonElement | null = productsClone.querySelector('.products__item-add-to-card');
            if (btnAddToCart) {
                const obj = this;
                if (this.app.cart?.inCart(item.id)) {
                    btnAddToCart.textContent = 'In cart';
                    btnAddToCart.style.background = '#aae0e785';
                } else {
                    btnAddToCart.textContent = 'Add to cart';
                }
                btnAddToCart.id = 'cart' + item.id.toString();
                btnAddToCart.addEventListener('click', function () {
                    if (obj.app.cart) {
                        if (obj.app.cart.inCart(item.id)) {
                            obj.app.cart.delProduct(item.id);
                            this.textContent = 'Add to cart';
                            this.style.background = '#efefef';
                        } else {
                            obj.app.cart.addProduct(item.id);
                            this.textContent = 'In cart';
                            this.style.background = '#aae0e785';
                        }
                    }
                });
            }

            const btnDetails: HTMLButtonElement | null = productsClone.querySelector('.products__item-details');
            if (btnDetails) {
                const obj = this;
                btnDetails.dataset.id = item.id.toString();
                btnDetails.addEventListener('click', function () {
                    obj.route.goProductPage(item.id.toString());
                    obj.app.productDetails = new ProductDetail(item.id, obj.app);
                    obj.app.productDetails.drawDetails();
                });
            }
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
        this.drawViewButtonBorder(this.view);

        // отображаем макс и мин бегунков
        tmp = document.getElementById('nPriceMin');
        if (tmp !== null) tmp.innerHTML = String(this.priceMin);
        tmp = document.getElementById('nPriceMax');
        if (tmp !== null) tmp.innerHTML = String(this.priceMax);
        tmp = document.getElementById('nWeightMin');
        if (tmp !== null) tmp.innerHTML = String(this.weightMin);
        tmp = document.getElementById('nWeightMax');
        if (tmp !== null) tmp.innerHTML = String(this.weightMax);
        const numProducts: HTMLElement | null = document.querySelector('.num__products');
        if (numProducts) numProducts.style.display = 'block';
    }

    drawSide(): void {
        const fragmentCat: DocumentFragment | null = document.createDocumentFragment();
        const fragmentBrand: DocumentFragment | null = document.createDocumentFragment();
        const categoryItemTemp: HTMLTemplateElement | null = document.querySelector('#catsItemTemp');
        const brandItemTemp: HTMLTemplateElement | null = document.querySelector('#brandsItemTemp');

        if (categoryItemTemp) {
            this.categories.forEach((item: string, idx: number) => {
                const catClone = categoryItemTemp.content.cloneNode(true) as HTMLElement;
                fragmentCat.append(this.drawCheckbox(catClone, item, idx, 'category'));
            });
        }
        if (brandItemTemp) {
            this.brands.forEach((item: string, idx: number) => {
                const brandClone = brandItemTemp.content.cloneNode(true) as HTMLElement;
                fragmentBrand.append(this.drawCheckbox(brandClone, item, idx, 'brand'));
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

    drawViewButtonBorder(view: string) {
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

    // -------------------  функции  слайдера --------------------------
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
            console.log('mousemove');
            const pos = e.clientX;
            let newLeft = pos - parent.coords.leftX;
            const rigthEdge = parent.coords.width - (coords.width + 1);

            if (newLeft < 0) {
                newLeft = 0;
            } else if (newLeft > rigthEdge) {
                newLeft = rigthEdge;
            }
            if (f === 0 && pos > block2.coords.left - block2.coords.width)
                newLeft = block2.coords.left - block2.coords.width - 5 - parent.coords.leftX;
            else if (f === 1 && pos < block2.coords.rigth + 5) newLeft = block2.coords.rigth + 5 - parent.coords.leftX;

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
            indicator.style.top = parseFloat(window.getComputedStyle(elem).getPropertyValue('top')) + 42 + 'px';
            indicator.innerHTML = value;

            /*Делаем плашечку диапазона выбора*/
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
            obj.data = obj.formData();
            obj.drawCheckboxValues();
            obj.route.setBoundaries(obj.curPriceMin, obj.curPriceMax, 'price');
            obj.route.setBoundaries(obj.curWeightMin, obj.curWeightMax, 'weight');
            obj.draw();
            obj.drawPages();
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('touchend', onMouseUp);
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
        this.curPriceMin = 0;
        this.curPriceMax = 0;
        this.curWeightMin = 0;
        this.curWeightMax = 0;
        this.route.weightFrom = '';
        this.route.weightTo = '';
        this.route.priceFrom = '';
        this.route.priceTo = '';
        this.route.setBoundaries(0, 0, 'price');
        this.route.setBoundaries(0, 0, 'weight');
    }
    getBegunokCurVal() {
        let tmp: HTMLElement | null;
        if (this.priceMinE !== null) {
            const tmp = this.priceMinE.getElementsByTagName('div')[0];
            if (tmp !== null && tmp !== undefined) this.curPriceMin = +tmp.innerHTML;
        }
        if (this.priceMaxE !== null) {
            tmp = this.priceMaxE.getElementsByTagName('div')[0];
            if (tmp !== null && tmp !== undefined) this.curPriceMax = +tmp.innerHTML;
        }
        if (this.weightMinE !== null) {
            tmp = this.weightMinE.getElementsByTagName('div')[0];
            if (tmp !== null && tmp !== undefined) this.curWeightMin = +tmp.innerHTML;
        }
        if (this.weightMaxE !== null) {
            const tmp = this.weightMaxE.getElementsByTagName('div')[0];
            if (tmp !== null && tmp !== undefined) this.curWeightMax = +tmp.innerHTML;
        }
    }

    setBegunokPos(pMin: number, pMax: number, wMin: number, wMax: number) {
        let k1 = 0;
        let k2 = 0;
        if (this.weightRange !== null && this.weightMinE !== null && this.weightMaxE !== null) {
            const coor = this.weightRange.getBoundingClientRect();
            if (wMin > this.weightMin) {
                k1 = (wMin - this.weightMin) / (this.weightMax - this.weightMin);
                this.weightMinE.style.left = k1 * coor.width + 'px';
            }
            if (wMax < this.weightMax) {
                k2 = (wMax - this.weightMin) / (this.weightMax - this.weightMin);
                this.weightMaxE.style.left = k2 * coor.width + 'px';
            }
            if (k1 > 0) this.weightRange.style.left = k1 * coor.width + 'px';
            if (k2 > 0) this.weightRange.style.width = (k2 - k1) * coor.width + 'px';
        }
        k1 = 0;
        k2 = 0;
        if (this.priceRange !== null && this.priceMaxE !== null && this.priceMinE !== null) {
            const coor = this.priceRange.getBoundingClientRect();
            if (pMin > this.priceMin) {
                k1 = (pMin - this.priceMin) / (this.priceMax - this.priceMin);
                this.priceMinE.style.left = k1 * coor.width + 'px';
            }
            if (pMax < this.priceMax) {
                k2 = (pMax - this.priceMin) / (this.priceMax - this.priceMin);
                this.priceMaxE.style.left = k2 * coor.width + 'px';
            }
            if (k1 > 0) this.priceRange.style.left = k1 * coor.width + 'px';
            if (k2 > 0) this.priceRange.style.width = (k2 - k1) * coor.width + 'px';
        }

        function setPosOne(elem: HTMLElement, val: number) {
            const coords = getCoords(elem);
            let tmp = document.createElement('div');
            if (elem.childElementCount <= 0) {
                elem.appendChild(tmp);
            } else tmp = elem.getElementsByTagName('div')[0];
            if (tmp !== null && tmp !== undefined) {
                tmp.style.position = 'absolute';
                tmp.style.fontSize = '11px';
                tmp.style.left = -coords.width / 2 + 'px';
                tmp.style.color = '#861806';
                tmp.style.top = parseFloat(window.getComputedStyle(elem).getPropertyValue('top')) + 42 + 'px';
            }
            if (tmp !== null && tmp !== undefined) tmp.innerHTML = String(val);
        }
        let elem = this.priceMinE;
        if (elem !== null) setPosOne(elem, pMin);
        elem = this.priceMaxE;
        if (elem !== null) setPosOne(elem, pMax);
        elem = this.weightMinE;
        if (elem !== null) setPosOne(elem, wMin);
        elem = this.weightMaxE;
        if (elem !== null) setPosOne(elem, wMax);
    }
    clear() {
        // console.log('pl');
        this.route.clear();
        this.currentPage = 0;
        this.curPriceMin = this.mainPriceMin;
        this.curPriceMax = this.mainPriceMax;
        this.curWeightMin = this.mainWeightMin;
        this.curWeightMax = this.mainWeightMax;
        this.moveBegunokToStart();
        this.data = this.formData();
        this.drawSide();
        this.draw();
        this.drawPages();
    }
}

function getCoords(elem: HTMLElement) {
    /*Получаем координаты относительно окна браузера*/
    const coords = elem.getBoundingClientRect();
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
