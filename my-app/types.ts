export type Category = "FRAME" | "LENS" | "GLASSES" | "HEARING_AID" | "LENS_WATER" | "ACCESSORY" | "SUNGLASS";

export interface Product {
  _id: string;
  name: string;
  category: Category;
  stockQty: number;
  sellingPrice: number;
  desc?: string;
}

export interface CartItem extends Product {
  qty: number;
}