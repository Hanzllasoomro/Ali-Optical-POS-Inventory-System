"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";

type Product = {
  _id: string;
  name: string;
  sku: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stockQty: number;
  reorderLevel?: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "FRAME",
    costPrice: 0,
    sellingPrice: 0,
    stockQty: 0,
    reorderLevel: 5,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = async () => {
    setError(null);
    setLoading(true);
    try {
      await api.post("/products", newProduct);
      setNewProduct({
        name: "",
        sku: "",
        category: "FRAME",
        costPrice: 0,
        sellingPrice: 0,
        stockQty: 0,
        reorderLevel: 5,
      });
      fetchProducts();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (_id: string) => {
    await api.delete(`/products/${_id}`);
    fetchProducts();
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[--color-muted]">Catalog</p>
        <h2 className="text-2xl font-semibold text-[--foreground]">Products</h2>
        <p className="text-sm text-[--color-muted]">Add SKU, category, cost, price, and stock.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <label className="space-y-1">
          <span className="text-sm font-medium">Name</span>
          <input
            type="text"
            placeholder="Aviator Gold"
            className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">SKU</span>
          <input
            type="text"
            placeholder="SKU-001"
            className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2"
            value={newProduct.sku}
            onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value.toUpperCase() })}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">Category</span>
          <select
            className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          >
            <option value="FRAME">Frame</option>
            <option value="LENS">Lens</option>
            <option value="GLASSES">Glasses</option>
            <option value="HEARING_AID">Hearing Aid</option>
            <option value="LENS_WATER">Lens Water</option>
            <option value="ACCESSORY">Accessory</option>
            <option value="SUNGLASS">Sun-glasses</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">Cost Price</span>
          <input
            type="number"
            placeholder="800"
            className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2"
            value={newProduct.costPrice}
            onChange={(e) => setNewProduct({ ...newProduct, costPrice: +e.target.value })}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">Selling Price</span>
          <input
            type="number"
            placeholder="1200"
            className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2"
            value={newProduct.sellingPrice}
            onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: +e.target.value })}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">Stock Qty</span>
          <input
            type="number"
            placeholder="10"
            className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2"
            value={newProduct.stockQty}
            onChange={(e) => setNewProduct({ ...newProduct, stockQty: +e.target.value })}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">Reorder Level</span>
          <input
            type="number"
            placeholder="5"
            className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2"
            value={newProduct.reorderLevel}
            onChange={(e) => setNewProduct({ ...newProduct, reorderLevel: +e.target.value })}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 items-center rounded-xl border border-[--color-border] bg-white px-3 py-2 shadow-sm">
        <button
          className="rounded-lg border border-[--color-primary] bg-[--color-primary] px-4 py-3 text-black font-semibold shadow hover:-translate-y-[1px] hover:bg-[--color-primary-strong] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--color-primary] disabled:opacity-60"
          onClick={handleAdd}
          disabled={loading}
          type="button"
        >
          {loading ? "Adding..." : "Add product"}
        </button>
        <button
          className="rounded-lg border border-[--color-border] bg-white px-4 py-3 font-semibold text-[--color-muted] hover:text-[--foreground]"
          onClick={() =>
            setNewProduct({
              name: "",
              sku: "",
              category: "FRAME",
              costPrice: 0,
              sellingPrice: 0,
              stockQty: 0,
              reorderLevel: 5,
            })
          }
          type="button"
        >
          Clear
        </button>
      </div>

      <div className="bg-white shadow rounded-2xl border border-[--color-border] p-4 space-y-3">
        {products.map((p) => (
          <div key={p._id} className="flex justify-between items-start border-b border-[--color-border] pb-3 last:border-none last:pb-0">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[--foreground]">{p.name}</h3>
                <span className="rounded-full bg-[--color-primary]/10 text-[--color-primary-strong] px-2 py-0.5 text-xs font-semibold">{p.sku}</span>
              </div>
              <p className="text-sm text-[--color-muted]">Category: {p.category}</p>
              <p className="text-sm text-[--color-muted]">Cost: {p.costPrice} · Price: {p.sellingPrice}</p>
              <p className="text-xs text-[--color-muted]">Stock: {p.stockQty} | Reorder at {p.reorderLevel ?? 5}</p>
            </div>
            <button onClick={() => handleDelete(p._id)} className="text-red-500 text-sm font-semibold">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
