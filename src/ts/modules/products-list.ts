import './products-list.scss';

import { products } from '../../assets/data/products';
import { IProduct } from '../types/product';

class ProductsList {
    draw(): void {
        const fragment = document.createDocumentFragment() as DocumentFragment;
        const productsItemTemp = document.querySelector('#productsItemTemp') as HTMLTemplateElement;

        products.forEach((item: IProduct, idx: number) => {
            console.log(idx, item);

            const productsClone = productsItemTemp.content.cloneNode(true) as HTMLElement;

            const imageSrc = `./images/${item.img[0]}`;
            (productsClone.querySelector('.products__item-image') as HTMLImageElement).src = imageSrc;

            (productsClone.querySelector('.products__item-name') as HTMLElement).textContent = item.Name;
            (productsClone.querySelector('.products__item-price') as HTMLElement).textContent = item.Price.toString();
            (productsClone.querySelector('.products__item-id') as HTMLElement).textContent = item.ID.toString();
            (productsClone.querySelector('.products__item-category') as HTMLElement).textContent = item.Category;

            const weightElement = productsClone.querySelector('.products__item-weight') as HTMLElement;
            weightElement.textContent = (item.Weight ?? '').toString();

            const brandElement = productsClone.querySelector('.products__item-brand') as HTMLElement;
            brandElement.textContent = item.Brand ?? '';

            fragment.append(productsClone);
        });

        (document.querySelector('.products') as HTMLDivElement).innerHTML = '';
        (document.querySelector('.products') as HTMLDivElement).appendChild(fragment);
    }
}

export default ProductsList;
