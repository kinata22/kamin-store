export class Routes {
    url: URL;
    sort: string; //SortOder;
    page: number;
    cats: number[];
    brands: number[];
    view: string;
    weightFrom: string;
    weightTo: string;
    priceFrom: string;
    priceTo: string;
    product: number;
    cart: number;
    constructor() {
        this.url = new URL(window.location.href);
        this.product = -1;
        this.cart = -1;
        if (this.url.searchParams.has('product')) {
            const tmp = this.url.searchParams.get('product');
            if (typeof tmp === 'string') this.product = Number(tmp);
        } else if (this.url.searchParams.has('cart')) {
            this.cart = 1;
        }
        this.sort = 'none';
        if (this.url.searchParams.has('sort')) {
            const tmp = this.url.searchParams.get('sort');
            if (tmp == 'none' || tmp == 'wup' || tmp == 'wdown' || tmp == 'pup' || tmp == 'pdown') this.sort = tmp;
        }
        this.page = 0;
        if (this.url.searchParams.has('page')) {
            const tmp = this.url.searchParams.get('page');
            if (typeof tmp === 'string') this.page = parseInt(tmp);
        }
        this.brands = [];
        if (this.url.searchParams.has('brand')) {
            const tmp = this.url.searchParams.getAll('brand');
            if (Array.isArray(tmp)) tmp.forEach((item) => this.brands.push(parseInt(item)));
        }
        this.cats = [];
        if (this.url.searchParams.has('category')) {
            const tmp = this.url.searchParams.getAll('category');
            if (Array.isArray(tmp)) tmp.forEach((item) => this.cats.push(parseInt(item)));
        }
        this.view = 'plitka1';
        if (this.url.searchParams.has('view')) {
            const tmp = this.url.searchParams.get('view');
            if (tmp !== null) this.view = tmp;
        }
        this.weightFrom = '';
        this.weightTo = '';
        this.priceFrom = '';
        this.priceTo = '';
        if (this.url.searchParams.has('weightFrom')) {
            const tmp = this.url.searchParams.get('weightFrom');
            if (tmp !== null) this.weightFrom = tmp;
        }
        if (this.url.searchParams.has('weightTo')) {
            const tmp = this.url.searchParams.get('weightTo');
            if (tmp !== null) this.weightTo = tmp;
        }
        if (this.url.searchParams.has('priceTo')) {
            const tmp = this.url.searchParams.get('priceTo');
            if (tmp !== null) this.priceTo = tmp;
        }
        if (this.url.searchParams.has('priceFrom')) {
            const tmp = this.url.searchParams.get('priceFrom');
            if (tmp !== null) this.priceFrom = tmp;
        }
    }

    setSortOder(value: string) {
        this.sort = value;
        this.url.searchParams.delete('sort');
        this.url.searchParams.set('sort', value);
        //location.href = this.url.search;  перегружает страницу
        //location.hash = this.url.search;  добавляет £
        history.pushState({ page: this.url.search }, '', this.url.search);
    }
    setPage(value: number) {
        this.page = value;
        this.url.searchParams.delete('page');
        this.url.searchParams.set('page', String(value));
        history.pushState({ page: this.url.search }, '', this.url.search);
    }
    setCheckBox(idx: number, type: string, checked: boolean) {
        if (type === 'category') {
            const tmp = this.cats.indexOf(idx); // есть ли категория в уже выбранных
            const arrcat = this.url.searchParams.getAll('category'); // массив всех категорий из урл
            const tmppos = arrcat.indexOf(String(idx)); //  есть ли категория в урл
            console.log('setCheckBox tmp tmpps checked', tmp, tmppos, checked);
            // категория есть, и ее надо удалить, не выбрана
            if (tmp !== -1 && !checked) {
                this.cats.splice(tmp, 1);
                if (tmppos > -1) arrcat.splice(tmppos, 1);
            }
            // категориий нет, она выбрана, ее надо добавить
            if (tmp === -1 && checked) {
                this.cats.push(idx);
                if (tmppos === -1) arrcat.push(String(idx));
            }
            console.log('setCheckBox arrcat', arrcat);
            this.url.searchParams.delete('category'); // чистим массив категорий
            // и добавляем по нашему списку
            for (let i = 0; i < arrcat.length; i += 1) {
                this.url.searchParams.append('category', arrcat[i]);
            }
        }
        if (type === 'brand') {
            const tmp = this.brands.indexOf(idx);
            const arrbr = this.url.searchParams.getAll('brand');
            const tmppos = arrbr.indexOf(String(idx));
            if (tmp !== -1 && !checked) {
                this.brands.splice(tmp, 1);
                if (tmppos > -1) arrbr.splice(tmppos, 1);
            }
            if (tmp === -1 && checked) {
                this.brands.push(idx);
                if (tmppos === -1) arrbr.push(String(idx));
            }
            this.url.searchParams.delete('brand'); // чистим массив брендов
            // и добавляем по нашему списку
            for (let i = 0; i < arrbr.length; i += 1) {
                this.url.searchParams.append('brand', arrbr[i]);
            }
        }
        this.url.searchParams.delete('page'); // выбор сменили чекбоксов - выбор страниц удалили
        this.page = 0;
        console.log('setCheckBox arrcat', this.url.search);
        if (this.url.search === '') history.pushState({}, '', 'index.html');
        else history.pushState({}, '', this.url.search);
    }
    setView(view: string) {
        if (view === 'plitka1') {
            this.url.searchParams.set('view', 'plitka1');
            this.view = 'plitka1';
            console.log('view1');
        }
        if (view === 'plitka2') {
            this.url.searchParams.set('view', 'plitka2');
            this.view = 'plitka2';
        }
        if (this.url.search === '') history.pushState({}, '', 'index.html');
        else history.pushState({}, '', this.url.search);
    }

    setBoundaries(from: number, to: number, type: string) {
        const fromStr = type.concat('From');
        const toStr = type.concat('To');
        if (from < 1) this.url.searchParams.delete(fromStr);
        else this.url.searchParams.set(fromStr, String(from));

        if (to < 1) this.url.searchParams.delete(toStr);
        else this.url.searchParams.set(toStr, String(to));

        if (this.url.search === '') history.pushState({}, '', 'index.html');
        else history.pushState({}, '', this.url.search);
    }
    goProductPage(id: string) {
        this.clear();
        this.url.searchParams.set('product', id);
        history.pushState({ page: this.url.search }, '', this.url.search);
    }
    clear() {
        // console.log('clear');
        this.url.searchParams.delete('category');
        this.url.searchParams.delete('brand');
        this.url.searchParams.delete('weightFrom');
        this.url.searchParams.delete('weightTo');
        this.url.searchParams.delete('priceFrom');
        this.url.searchParams.delete('priceTo');
        this.cats.length = 0;
        this.brands.length = 0;
        this.weightFrom = '';
        this.weightTo = '';
        this.priceFrom = '';
        this.priceTo = '';
        history.pushState({}, '', 'index.html');
        // window.history.pushState({}, '', 'index.html');
    }
}
