"use client";

import React from "react";

type Product = {
  _id: string;
  name: string;
  sellingPrice: number;
  stockQty: number;
};

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white shadow p-3 rounded cursor-pointer hover:shadow-md transition"
          onClick={() => onAddToCart(product)}
        >
          <h3 className="font-semibold text-sm">{product.name}</h3>
          <p className="text-xs text-gray-500">Price: PKR {product.sellingPrice}</p>
          <p className="text-xs text-gray-400">Stock: {product.stockQty}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
