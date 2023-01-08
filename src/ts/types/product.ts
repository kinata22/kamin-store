export interface IProduct {
    name: string;
    price: number;
    id: number;
    category: string;
    weight: number;
    brand: string;
    img: string[];
    quantity: number;
}

export interface IProductInCart {
    product: IProduct;
    n: number;
}

export interface ICoords {
    top: number;
    left: number;
    leftX: number;
    rigth: number;
    bottom: number;
    width: number;
}

export interface ICoord {
    top: number;
    left: number;
    leftX: number;
    rigth: number;
    bottom: number;
    width: number;
}

export interface IParent {
    element: HTMLElement;
    coords: ICoord;
}
