import './modal.scss';
import App from '../app';

class ModalWin {
    app: App;
    win: HTMLElement | null;
    butClose: HTMLElement | null;

    constructor(app: App) {
        this.app = app;
        this.win = document.getElementById('modal');
        this.butClose = document.querySelector('.modal__close');
        if (this.butClose) {
            this.butClose.addEventListener('click', function () {
                app.modalWin?.close();
            });
        }
        const creditCard: HTMLDivElement | null = document.querySelector('.credit-card');
        if (creditCard) {
            creditCard.style.backgroundImage = 'url("./images/card.png")';
        }
        const confirm: HTMLElement | null = document.getElementById('confirm');
        if (confirm) {
            confirm.addEventListener('click', function () {
                const res = app.modalWin?.confirm();
                if (res) app.cart?.clearCart();
                return res;
            });
        }
        const cardValid: HTMLInputElement | null = document.querySelector('.input__card-valid');
        cardValid?.addEventListener('input', function () {
            this.value = this.value.length === 2 ? this.value + '/' : this.value;
            if (this.value.length > 5) {
                this.value = this.value.slice(0, 5);
            }
        });
        const cardNumber: HTMLInputElement | null = document.querySelector('.input__card-number');
        cardNumber?.addEventListener('input', function () {
            const logo: HTMLImageElement | null = document.querySelector('.credit-card-img');
            if (logo) {
                if (this.value[0] === '4') logo.src = './images/visa.png';
                else if (this.value[0] === '5') logo.src = './images/mc.png';
                else if (this.value[0] === '3') logo.src = './images/ae.png';
                else logo.src = './images/card.png';
            }
        });
        const form: HTMLFormElement | null = document.querySelector('.modal__form');
        const obj = this;
        form?.addEventListener('onsubmit', function () {
            if (obj.confirm()) app.cart?.clearCart();
        });
    }

    show() {
        if (this.win) this.win.style.display = 'flex';
    }
    close() {
        if (this.win) this.win.style.display = 'none';
    }
    confirm() {
        const fio: HTMLInputElement | null = document.querySelector('.input__full-name');
        const error_mess: HTMLElement | null = document.querySelector('.error_mess');
        const phone: HTMLInputElement | null = document.querySelector('.input__phone');
        const delivery: HTMLInputElement | null = document.querySelector('.input__delivery');
        const cardNumber: HTMLInputElement | null = document.querySelector('.input__card-number');
        const cardValid: HTMLInputElement | null = document.querySelector('.input__card-valid');
        const cardCVV: HTMLInputElement | null = document.querySelector('.input__card-cvv');

        let mess = '';
        if (fio) {
            const arrfio = fio.value.split(' ').map((item) => item.length);
            const res = arrfio.reduce((sum, current) => (current - 2 ? sum + 1 : sum + 0), 0);
            console.log(fio.value.length, arrfio.length, res);
            if (fio.value.length >= 7 && arrfio.length >= 2 && res > 1) mess = '';
            else mess = 'Name must consist from two or more words and length of word must be more than 2';
        }
        if (mess.length <= 0)
            if (phone) {
                const tmp = phone.value;
                if (tmp[0] === '+' && tmp.length >= 10 && tmp.match(/^[+0-9]+$/) != null) mess = '';
                else mess = 'Phone must begin from + and number of digits must be more than 9';
                console.log(tmp.match(/^[+0-9]+$/), 'phone');
            }
        if (mess.length <= 0)
            if (delivery) {
                const tmp = delivery.value;
                const arrfio = delivery.value.split(' ').map((item) => item.length);
                const res = arrfio.reduce((sum, current) => (current - 5 ? sum + 1 : sum + 0), 0);
                if (tmp.length >= 18 && arrfio.length >= 3 && res > 2) mess = '';
                else mess = 'Delivery adress must consist from 3 (or more) words with length 5 оr more symbols';
            }
        if (mess.length <= 0)
            if (cardNumber) {
                const tmp = cardNumber.value;
                if (tmp.length === 16 && tmp.match(/^[0-9]{16}$/) != null) mess = '';
                else mess = 'card Number must consist from 16 digits';
            }
        if (mess.length <= 0)
            if (cardValid) {
                const tmp = cardValid.value.split('/');
                if (
                    tmp.length === 2 &&
                    Number(tmp[0]) < 13 &&
                    Number(tmp[0]) > 0 &&
                    Number(tmp[1]) > 22 &&
                    Number(tmp[1]) < 40
                )
                    mess = '';
                else mess = 'card Valid must have format MM/YY and be actual';
            }
        if (mess.length <= 0)
            if (cardCVV) {
                const tmp = cardCVV.value;
                if (tmp.length === 3 && tmp.match(/^[0-9]{3}$/) != null) mess = '';
                else mess = 'card Valid must consist from 3 digits';
            }
        if (error_mess) {
            error_mess.innerHTML = mess;
            return false;
        }
        return true;
    }
}
export default ModalWin;
