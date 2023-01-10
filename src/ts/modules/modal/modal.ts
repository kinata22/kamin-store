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
        const confirm: HTMLElement | null = document.querySelector('.confirm__btn');
        if (confirm) {
            confirm.addEventListener('click', function () {
                app.modalWin?.confirm();
            });
        }
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
        if (error_mess) error_mess.innerHTML = mess;
    }
}
/*
constructor {
    const modal = document.createElement('div');
    modal.className = 'container';
    modal.setAttribute('data-close', '');

    const content = document.createElement('div');
    content.className = 'modal__content';

    const buttonClose = document.createElement('button');
    buttonClose.className = 'modal__close';
    buttonClose.setAttribute('data-close', '');
    buttonClose.textContent = 'X';

    const labelDetail = document.createElement('h2');
    labelDetail.className = 'modal__title';
    labelDetail.textContent = 'Personal detail';

    const formFields = document.createElement('form');
    formFields.className = 'form__content';

    const blockFullName = document.createElement('div');
    blockFullName.className = 'block';

    const errorMessageFullName = document.createElement('span');
    errorMessageFullName.className = 'error-message';

    const inputFullName = document.createElement('input');
    inputFullName.className = 'input input__full-name';
    inputFullName.required = true;
    inputFullName.placeholder = 'Name';
    inputFullName.addEventListener('input', validateFullName);

    blockFullName.append(inputFullName, errorMessageFullName);

    const blockPhone = document.createElement('div');
    blockPhone.className = 'block';

    const errorMessagePhone = document.createElement('span');
    errorMessagePhone.className = 'error-message';

    const inputPhone = document.createElement('input');
    inputPhone.className = 'input input__phone';
    inputPhone.required = true;
    inputPhone.addEventListener('input', validatePhone);
    inputPhone.placeholder = 'Phone number';

    blockPhone.append(inputPhone, errorMessagePhone);

    const blockDelivery = document.createElement('div');
    blockDelivery.className = 'block';

    const errorMessageDelivery = document.createElement('span');
    errorMessageDelivery.className = 'error-message';

    const inputDelivery = document.createElement('input');
    inputDelivery.className = 'input input__delivery';
    inputDelivery.required = true;
    inputDelivery.addEventListener('input', validateDelivery);
    inputDelivery.placeholder = 'Delivery address';
    blockDelivery.append(inputDelivery, errorMessageDelivery);

    const blockEmail = document.createElement('div');
    blockEmail.className = 'block';

    const errorMessageEmail = document.createElement('span');
    errorMessageEmail.className = 'error-message';

    const inputEmail = document.createElement('input');
    inputEmail.className = 'input input__email';
    inputEmail.required = true;
    inputEmail.type = 'email';
    inputEmail.addEventListener('input', validateEmail);
    inputEmail.placeholder = 'E-mail';

    blockEmail.append(inputEmail, errorMessageEmail);

    const labelCard = document.createElement('h2');
    labelCard.className = 'modal__title';
    labelCard.textContent = 'Credit cart detail';

    const btnConfirm = document.createElement('button');
    btnConfirm.className = 'confirm__btn';
    btnConfirm.textContent = 'Confirm';

    const cardFront = document.createElement('div');
    cardFront.className = 'credit-card';

    const divPayment = document.createElement('div');
    divPayment.className = 'credit-card-img';

    const imgPayment = document.createElement('img');
    imgPayment.className = 'credit-card-img';

    const inputCardNumber = document.createElement('input');
    inputCardNumber.className = 'input__card input__card-number';
    imgPayment.src = cardType();
    inputCardNumber.addEventListener('input', () => {
        const regExp = new RegExp('[\\D]', 'gi');
        inputCardNumber.value = inputCardNumber.value.replace(regExp, '');
        imgPayment.src = cardType();
        validateCardNumber();
    });
    inputCardNumber.placeholder = 'Card number';

    const cardDetailContainer = document.createElement('div');
    cardDetailContainer.className = 'card__detail-row';

    const inputCardValid = document.createElement('input');
    inputCardValid.className = 'input__card input__card-valid';
    inputCardValid.id = 'card-valid';
    inputCardValid.placeholder = 'MM/YY';
    inputCardValid.addEventListener('input', () => {
        const regExp = new RegExp('[\\D[^\\/]]', 'gi');
        inputCardValid.value = inputCardValid.value.replace(regExp, '');

        inputCardValid.value = inputCardValid.value.length === 2 ? inputCardValid.value + '/' : inputCardValid.value;
        if (inputCardValid.value.length > 5) {
            inputCardValid.value = inputCardValid.value.slice(0, 5);
        }
        validateCardValid();
    });
    inputCardValid.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Backspace') {
            inputCardValid.value =
                inputCardValid.value.length === 3 ? inputCardValid.value.slice(0, -1) : inputCardValid.value;
        }
    });

    const labelCardValid = document.createElement('label');
    labelCardValid.className = 'card__valid';
    labelCardValid.htmlFor = inputCardValid.id;
    labelCardValid.textContent = 'VALID:';

    const inputCardCVV = document.createElement('input');
    inputCardCVV.className = 'input__card input__card-cvv';
    inputCardCVV.id = 'card-cvv';
    inputCardCVV.placeholder = 'Code';
    inputCardCVV.addEventListener('input', () => {
        const regExp = new RegExp('[\\D]', 'gi');
        inputCardCVV.value = inputCardCVV.value.replace(regExp, '');
        inputCardCVV.value = inputCardCVV.value.length > 3 ? inputCardCVV.value.slice(1, 4) : inputCardCVV.value;
        validateCardCVV();
    });

    const labelCardCVV = document.createElement('label');
    labelCardCVV.className = 'card__cvv';
    labelCardCVV.htmlFor = inputCardCVV.id;
    labelCardCVV.textContent = 'CVV:';

    const errorMessageCardNumber = document.createElement('giv');
    errorMessageCardNumber.className = 'error-message';

    const errorMessageCardValid = document.createElement('giv');
    errorMessageCardValid.className = 'error-message';

    const errorMessageCardCVV = document.createElement('giv');
    errorMessageCardCVV.className = 'error-message';

    cardDetailContainer.append(labelCardValid, inputCardValid, labelCardCVV, inputCardCVV);
    cardFront.append(inputCardNumber, cardDetailContainer, imgPayment);
    formFields.append(labelDetail, blockFullName, blockPhone, blockDelivery, blockEmail);

    formFields.append(labelCard, cardFront);
    formFields.append(errorMessageCardNumber, errorMessageCardValid, errorMessageCardCVV);
    formFields.append(btnConfirm);
}
function renderModal() {
    content.append(buttonClose);
    content.append(formFields);
    modal.append(content);
}

export function showModal() {
    const header = document.querySelector('#header');
    renderModal();
    document.body.insertBefore(modal, header);
    document.body.classList.add('lock');
    modal.addEventListener('click', hideModal);
    btnConfirm.addEventListener('click', validateModal);
}

function hideModal(e: Event) {
    const target = e.target as HTMLElement;
    if (target.hasAttribute('data-close')) {
        if (content) content.remove();
        setTimeout(() => {
            if (modal) {
                modal.remove();
                document.body.classList.remove('lock');
            }
        }, 1);
    }
}
function validateModal(e: Event) {
    validateFullName();
    validatePhone();
    validateDelivery();
    validateEmail();
    validateCardNumber();
    validateCardValid();
    validateCardCVV();
    e.preventDefault();
    if (
        isFullNameValid() &&
        isPhoneValid() &&
        isDeliveryValid() &&
        isEmailValid() &&
        isCardNumberValid() &&
        isCardValid() &&
        isCardCVVValid()
    ) {
        cart.clearCart();
        promo.clearPromos();
        if (content) content.remove();
        modal.innerHTML = '<h3 class="modal-message">Thanks for your order.</h3>';
        setTimeout(() => {
            if (modal) {
                modal.remove();
                document.body.classList.remove('lock');
            }
            history.pushState('', '', window.location.origin + '/');
            window.history.go();
        }, 5000);
    }
}
function validateFullName() {
    if (isFullNameValid()) {
        inputFullName.classList.remove('invalid');
        inputFullName.classList.add('valid');
        errorMessageFullName.textContent = '';
    } else {
        inputFullName.classList.remove('valid');
        inputFullName.classList.add('invalid');
        errorMessageFullName.textContent = ErrorMessage.ERROR_MESSAGE;
    }
}
function validatePhone() {
    if (isPhoneValid()) {
        inputPhone.classList.remove('invalid');
        inputPhone.classList.add('valid');
        errorMessagePhone.textContent = '';
    } else {
        inputPhone.classList.remove('valid');
        inputPhone.classList.add('invalid');
        errorMessagePhone.textContent = ErrorMessage.ERROR_MESSAGE;
    }
}
function validateDelivery() {
    if (isDeliveryValid()) {
        inputDelivery.classList.remove('invalid');
        inputDelivery.classList.add('valid');
        errorMessageDelivery.textContent = '';
    } else {
        inputDelivery.classList.remove('valid');
        inputDelivery.classList.add('invalid');
        errorMessageDelivery.textContent = ErrorMessage.ERROR_MESSAGE;
    }
}
function validateEmail() {
    if (isEmailValid()) {
        inputEmail.classList.remove('invalid');
        inputEmail.classList.add('valid');
        errorMessageEmail.textContent = '';
    } else {
        inputEmail.classList.remove('valid');
        inputEmail.classList.add('invalid');
        errorMessageEmail.textContent = ErrorMessage.ERROR_MESSAGE;
    }
}
function validateCardNumber() {
    if (isCardNumberValid()) {
        inputCardNumber.classList.remove('invalid-card');
        inputCardNumber.classList.add('valid-card');
        errorMessageCardNumber.textContent = '';
    } else {
        inputCardNumber.classList.remove('valid-card');
        inputCardNumber.classList.add('invalid-card');
        errorMessageCardNumber.textContent = ErrorMessage.ERROR_CARD_NUMBER;
    }
}
function validateCardValid() {
    if (isCardValid()) {
        inputCardValid.classList.remove('invalid-card');
        inputCardValid.classList.add('valid-card');
        errorMessageCardValid.textContent = '';
    } else {
        inputCardValid.classList.remove('valid-card');
        inputCardValid.classList.add('invalid-card');
        errorMessageCardValid.textContent = ErrorMessage.ERROR_CARD_VALID;
    }
}
function validateCardCVV() {
    if (isCardCVVValid()) {
        inputCardCVV.classList.remove('invalid-card');
        inputCardCVV.classList.add('valid-card');
        errorMessageCardCVV.textContent = '';
    } else {
        inputCardCVV.classList.remove('valid-card');
        inputCardCVV.classList.add('invalid-card');
        errorMessageCardCVV.textContent = ErrorMessage.ERROR_CARD_CVV;
    }
}
function isFullNameValid() {
    const arrayFullName = inputFullName.value.replace(/\s+/g, ' ').trim().split(' ');
    if (arrayFullName.length < 2) {
        return false;
    }
    const regExp = new RegExp('(^[A-ZА-ЯЁ]{3,})', 'i');
    return arrayFullName.every((elem: string) => regExp.test(elem));
}
function isPhoneValid() {
    const regExp = new RegExp('^\\+([0-9]{9,})', 'i');
    return regExp.test(inputPhone.value);
}
function isDeliveryValid() {
    const arrayDelivery = inputDelivery.value.replace(/\s+/g, ' ').trim().split(' ');
    if (arrayDelivery.length < 3) {
        return false;
    }
    const regExp = new RegExp('(^[A-ZА-ЯЁ0-9,\\-\\/]{5,})', 'i');
    return arrayDelivery.every((elem: string) => regExp.test(elem));
}
function isEmailValid() {
    const regExp = new RegExp('^\\S+@\\S+\\.\\S+$', 'i');
    return regExp.test(String(inputEmail.value));
}

function isCardNumberValid() {
    const regExp = new RegExp('^([0-9]{16})$', 'i');
    return regExp.test(inputCardNumber.value);
}
function isCardValid() {
    const regExp = new RegExp('^([0][1-9]|[1][1-2]/[0-9]{2,2})', 'i');
    return regExp.test(inputCardValid.value);
}

function isCardCVVValid() {
    const regExp = new RegExp('^([0-9]{3})$', 'i');
    return regExp.test(inputCardCVV.value.replace(/\s+/g, ''));
}

function cardType() {
    const number = inputCardNumber.value;
    const regExpVisa = new RegExp('^4');
    if (number.match(regExpVisa) != null) {
        return `${payment.visa}`;
    }

    const regExpAmex = new RegExp('^(34|37)');
    if (number.match(regExpAmex) != null) {
        return `${payment.amex}`;
    }

    const regExpMastercard = new RegExp('^5[1-5]');
    if (number.match(regExpMastercard) != null) {
        return `${payment.mastercard}`;
    }

    const regExpDiscover = new RegExp('^6011');
    if (number.match(regExpDiscover) != null) {
        return `${payment.discover}`;
    }

    const regExpUnionPay = new RegExp('^62');
    if (number.match(regExpUnionPay) != null) {
        return `${payment.unionpay}`;
    }

    const regExpTroy = new RegExp('^9792');
    if (number.match(regExpTroy) != null) {
        return `${payment.troy}`;
    }

    const regExpDinersclub = new RegExp('^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}');
    if (number.match(regExpDinersclub) != null) {
        return `${payment.dinersclub}`;
    }

    const regExpJcb = new RegExp('^35(2[89]|[3-8])');
    if (number.match(regExpJcb) != null) {
        return `${payment.jcb}`;
    }
    return `${payment.chip}`;
  
}
}*/
export default ModalWin;
