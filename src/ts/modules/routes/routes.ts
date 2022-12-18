export type SortOder = 'none' | 'wup' | 'wdown' | 'pup' | 'pdown';
export class Routes {
    url: URL;
    sort: SortOder;
    page: number;
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
    }
}
