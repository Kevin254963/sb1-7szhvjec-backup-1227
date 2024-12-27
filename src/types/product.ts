export interface Product {
  id: string;
  name: string;
  description: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  hsCode: string;
  price: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  length: string;
  width: string;
  height: string;
  hsCode: string;
  price: string;
  stock: string;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}