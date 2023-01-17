import './cart.scss';
import { IProduct, IProductInCart } from '../../types/product';
import { products } from '../../../assets/data/products';
import App from '../app';

class Cart {
    data: Array<IProductInCart>;
    buyBtn: HTMLElement | null;
    app: App;

    constructor(app: App) {
        this.app = app;
        this.data = [];
        let count = 0;
        let sum = 0;
        const nItem = Number(localStorage.getItem('nProduct'));
        for (let i = 0; i < nItem; i += 1) {
            const idTmp = Number(localStorage.getItem('id' + i));
            if (idTmp > 0) {
                const tmpProduct: IProduct | undefined = products.find((elem) => elem.id === idTmp);
                const nTmp = Number(localStorage.getItem('n' + i)); // берем товар с данным id
                if (nTmp && tmpProduct !== undefined) {
                    this.data.push({ product: tmpProduct, n: nTmp });
                    count += nTmp;
                    sum += nTmp * tmpProduct.price;
                }
            }
        }

        const cartNum = document.getElementsByClassName('b-cart-button__counter');
        if (cartNum) cartNum[0].innerHTML = String(count);
        const cartVal = document.getElementsByClassName('cart-price__price');
        if (cartVal)
            cartVal[0].innerHTML = new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'EUR' }).format(sum);
        const numProducts: HTMLElement | null = document.querySelector('.num__products');
        if (numProducts) numProducts.style.display = 'none';
        this.buyBtn = document.querySelector('.buy__btn');
        if (this.buyBtn) {
            this.buyBtn.addEventListener('click', function () {
                app.modalWin?.show();
            });
        }
    }
    addProduct(id: number) {
        console.log('addproduct-before', this.data);

        let find = false;
        for (let i = 0; i < this.data.length; i += 1) {
            if (this.data[i].product.id === id) {
                //console.log('find', this.data[i].product.quantity, this);
                if (this.data[i].product.quantity > this.data[i].n) this.data[i].n++;
                find = true;
                break;
            }
        }
        console.log('addproduct-past', this.data);
        if (find === false) {
            const tmp = products.find((element) => element.id === id);
            if (tmp !== undefined) {
                const tmpproduct = { product: tmp, n: 1 };
                this.data.push(tmpproduct);
            }
        }
        this.saveCart();
    }
    delProduct(id: number) {
        for (let i = 0; i < this.data.length; i += 1) {
            if (this.data[i].product.id === id) {
                this.data.splice(i, 1);
                break;
            }
        }
        this.saveCart();
    }
    clearCart() {
        this.data.length = 0;
    }

    inCart(id: number): boolean {
        if (this.data.find((item) => item.product.id === id)) return true;
        return false;
    }
    saveCart() {
        console.log('save', this.data);
        localStorage.setItem('nProduct', String(this.data.length));
        let count = 0;
        let sum = 0;
        for (let i = 0; i < this.data.length; i += 1) {
            localStorage.setItem('id' + i, String(this.data[i].product.id));
            localStorage.setItem('n' + i, String(this.data[i].n));
            count += this.data[i].n;
            sum += this.data[i].product.price * this.data[i].n;
        }
        const cartNum = document.getElementsByClassName('b-cart-button__counter');
        if (cartNum) cartNum[0].innerHTML = String(count);
        const cartNumItog = document.getElementById('countE');
        if (cartNumItog) cartNumItog.innerHTML = String(count);
        const cartVal = document.getElementsByClassName('cart-price__price');
        if (cartVal)
            cartVal[0].innerHTML = new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'EUR' }).format(sum);
        const cartValItog = document.getElementById('priceE');
        if (cartValItog)
            cartValItog.innerHTML = new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'EUR' }).format(sum);
    }
    drawCart() {
        const fragment: DocumentFragment | null = document.createDocumentFragment();

        let tmp: HTMLElement | null = document.querySelector('.page-product-list');
        if (tmp) tmp.style.display = 'none';
        tmp = document.querySelector('.page-product-detail');
        if (tmp) tmp.style.display = 'none';
        tmp = document.querySelector('.page-cart');
        if (tmp) tmp.style.display = 'block';

        const templ: HTMLTemplateElement | null = document.querySelector('#cartItemTemp');
        const obj = this;
        if (this.data.length <= 0) {
            tmp = document.getElementById('cartList');
            if (tmp !== null) {
                tmp.innerHTML = '<h2>Cart is empty</h2>';
                if (this.buyBtn) this.buyBtn.style.display = 'none';
                return;
            }
        }
        if (this.buyBtn) this.buyBtn.style.display = 'block';
        if (templ != null && obj !== null) {
            let i = 1;
            let sum = 0;
            const templCur = <HTMLElement>templ.content.cloneNode(true);
            const htmlNum: HTMLElement | null = templCur.querySelector('.cart__item-num');
            if (htmlNum) htmlNum.textContent = '№';
            const htmlName: HTMLElement | null = templCur.querySelector('.cart__item-product');
            if (htmlName) htmlName.textContent = 'Product';
            const htmlCount: HTMLElement | null = templCur.querySelector('.cart__item-count');
            if (htmlCount) htmlCount.textContent = 'Num';
            const htmlPrice: HTMLElement | null = templCur.querySelector('.cart__item-price');
            if (htmlPrice) htmlPrice.textContent = 'Sum';
            if (fragment) fragment.append(templCur);

            // cicl
            this.data.forEach((item: IProductInCart) => {
                const templCur = <HTMLElement>templ.content.cloneNode(true);
                const htmlNum: HTMLElement | null = templCur.querySelector('.cart__item-num');
                if (htmlNum) htmlNum.textContent = String(i);

                const htmlName: HTMLAnchorElement | null = templCur.querySelector('.cart__item-link');
                if (htmlName) {
                    htmlName.textContent = item.product.name + ' (' + item.product.quantity + ' in stock)';
                    htmlName.href = `index.html?product=${item.product.id}`;
                }

                const htmlM: HTMLElement | null = templCur.querySelector('.cart__item-count-minus');
                if (htmlM !== null) {
                    htmlM.id = 'minus' + String(item.product.id);
                    htmlM.addEventListener('click', function () {
                        if (item.n > 0) item.n -= 1;
                        if (item.n === 0) {
                            obj.delProduct(item.product.id);
                            obj.saveCart();
                            location.reload();
                        } else {
                            obj.saveCart();
                            const tmpVal = document.getElementById('val' + String(item.product.id));
                            if (tmpVal) tmpVal.innerHTML = String(item.n);
                            const tmpPrice = document.getElementById('price' + String(item.product.id));
                            if (tmpPrice)
                                tmpPrice.innerHTML = new Intl.NumberFormat('en-EN', {
                                    style: 'currency',
                                    currency: 'EUR',
                                }).format(item.product.price * item.n);
                        }
                    });
                }
                const htmlP: HTMLElement | null = templCur.querySelector('.cart__item-count-plus');
                if (htmlP) {
                    htmlP.id = 'plus' + String(item.product.id);
                    htmlP.addEventListener('click', function () {
                        if (item.n < item.product.quantity) item.n += 1;
                        const tmpVal = document.getElementById('val' + String(item.product.id));
                        if (tmpVal) tmpVal.innerHTML = String(item.n);
                        const tmpPrice = document.getElementById('price' + String(item.product.id));
                        if (tmpPrice)
                            tmpPrice.innerHTML = new Intl.NumberFormat('en-EN', {
                                style: 'currency',
                                currency: 'EUR',
                            }).format(item.product.price * item.n);
                        obj.saveCart();
                    });
                }
                const htmlVal: HTMLElement | null = templCur.querySelector('.cart__item-count-val');
                if (htmlVal) {
                    htmlVal.textContent = String(item.n);
                    htmlVal.id = 'val' + String(item.product.id);
                }
                const htmlPrice: HTMLElement | null = templCur.querySelector('.cart__item-price');
                if (htmlPrice) {
                    htmlPrice.textContent = new Intl.NumberFormat('en-EN', {
                        style: 'currency',
                        currency: 'EUR',
                    }).format(item.product.price * item.n);
                    htmlPrice.id = 'price' + item.product.id;
                }
                if (fragment) fragment.append(templCur);
                i += 1;
                sum += item.n * item.product.price;
            });

            const htmlCountE: HTMLElement | null = document.getElementById('priceE');
            if (htmlCountE) {
                htmlCountE.innerHTML = new Intl.NumberFormat('en-EN', {
                    style: 'currency',
                    currency: 'EUR',
                }).format(sum);
            }

            tmp = document.getElementById('cartList');
            if (tmp !== null) {
                tmp.innerHTML = '';
                tmp.appendChild(fragment);
            }
        }
    }
}

export default Cart;
