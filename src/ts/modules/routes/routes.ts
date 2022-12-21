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
            const tmp = this.cats.indexOf(idx);
            if (tmp !== -1 && !checked) this.cats.splice(tmp, 1);
            if (tmp === -1 && checked) this.cats.push(idx);
        }
        if (type === 'brand') {
            const tmp = this.brands.indexOf(idx);
            if (tmp !== -1 && !checked) this.brands.splice(tmp, 1);
            if (tmp === -1 && checked) this.brands.push(idx);
        }
        // console.log('rotes', this.cats, checked, idx);
    }
}
