export class Routes {
    url: URL;
    sort: string | null;
    page: number;
    constructor() {
        this.url = new URL(window.location.href);
        if (this.url.searchParams.has('sort')) this.sort = this.url.searchParams.get('sort');
        else this.sort = 'none';
        this.page = 0;
        if (this.url.searchParams.has('page')) {
            const tmp = this.url.searchParams.get('page');
            if (typeof tmp === 'string') this.page = parseInt(tmp);
        }
    }
}
