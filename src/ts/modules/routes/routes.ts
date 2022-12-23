//export type SortOder = 'none' | 'wup' | 'wdown' | 'pup' | 'pdown';
export class Routes {
    url: URL;
    sort: string; //SortOder;
    page: number;
    cats: number[];
    brands: number[];
    constructor() {
        this.url = new URL(window.location.href);
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
        if (this.url.searchParams.has('cat')) {
            const tmp = this.url.searchParams.getAll('cat');
            if (Array.isArray(tmp)) tmp.forEach((item) => this.cats.push(parseInt(item)));
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
        history.pushState({ page: this.url.search }, '', this.url.search);
    }
}
