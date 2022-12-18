export type SortOder = 'none' | 'wup' | 'wdown' | 'pup' | 'pdown';
export class Routes {
    url: URL;
    sort: SortOder;
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
        console.log(this.cats, 'cats');
    }
}
