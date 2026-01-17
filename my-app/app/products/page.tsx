"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | string>("ALL");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "FRAME",
    costPrice: 0,
    sellingPrice: 0,
    stockQty: 0,
    reorderLevel: 5,
  });

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    const res = await api.get("/products");
    setProducts(res.data);
    setLoadingProducts(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const CATEGORY_OPTIONS = [
    { label: "All", value: "ALL" },
    { label: "Frame", value: "FRAME" },
    { label: "Lens", value: "LENS" },
    { label: "Glasses", value: "GLASSES" },
    { label: "Hearing Aid", value: "HEARING_AID" },
    { label: "Lens Water", value: "LENS_WATER" },
    { label: "Accessory", value: "ACCESSORY" },
    { label: "Sunglass", value: "SUNGLASS" },
    { label: "Eye Testing", value: "EYE_TESTING" },
  ];

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = !term || p.name.toLowerCase().includes(term) || p.sku?.toLowerCase().includes(term);
      const matchesCategory = selectedCategory === "ALL" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    const updates: any = { category };
    if (category === "EYE_TESTING") {
      updates.sellingPrice = 250;
      updates.costPrice = 250;
    }
    setNewProduct({ ...newProduct, ...updates });
  };

  const handleEditCategoryChange = (category: string) => {
    if (!editingProduct) return;
    const updates: any = { category };
    if (category === "EYE_TESTING") {
      updates.sellingPrice = 250;
      updates.costPrice = 250;
    }
    setEditingProduct({ ...editingProduct, ...updates });
  };

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
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${_id}`);
        fetchProducts();
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to delete product");
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;
    
    // Validate required fields
    if (!editingProduct.name.trim()) {
      setError("Product name is required");
      return;
    }
    if (!editingProduct.sku.trim()) {
      setError("SKU is required");
      return;
    }
    if (editingProduct.sellingPrice <= 0) {
      setError("Selling price must be greater than 0");
      return;
    }
    if (editingProduct.stockQty < 0) {
      setError("Stock quantity cannot be negative");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await api.put(`/products/${editingProduct._id}`, editingProduct);
      setIsEditModalOpen(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to update product";
      setError(errorMessage);
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (field: keyof Product, value: any) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [field]: value });
    }
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
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="FRAME">Frame</option>
            <option value="LENS">Lens</option>
            <option value="GLASSES">Glasses</option>
            <option value="HEARING_AID">Hearing Aid</option>
            <option value="LENS_WATER">Lens Water</option>
            <option value="ACCESSORY">Accessory</option>
            <option value="SUNGLASS">Sun-glasses</option>
            <option value="EYE_TESTING">Eye Testing</option>
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

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 rounded-xl border border-[--color-border] bg-white px-3 py-2 shadow-sm">
            <span className="text-[--color-muted] text-sm">Search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name or SKU..."
              className="flex-1 bg-transparent outline-none text-[--foreground]"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-[--color-muted]">
            <span className="h-2 w-2 rounded-full bg-[--color-primary]"></span>
            {loadingProducts ? "Loading products..." : `${filteredProducts.length} items`}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 overflow-x-auto rounded-xl border border-[--color-border] bg-white p-2 shadow-sm">
          {CATEGORY_OPTIONS.map((option) => {
            const isActive = option.value === selectedCategory;
            return (
              <button
                key={option.value}
                onClick={() => setSelectedCategory(option.value)}
                className={`rounded-lg px-3 py-1 text-sm font-semibold transition border ${
                  isActive
                    ? "bg-[--color-primary]/10 text-[--color-primary-strong] border-[--color-primary]"
                    : "bg-white text-[--foreground] border-[--color-border] hover:bg-[--color-border]/50"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="bg-white shadow rounded-2xl border border-[--color-border] p-4 space-y-3">
          {filteredProducts.map((p) => (
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
              <div className="flex gap-2">
                <button onClick={() => handleEdit(p)} className="text-[--color-primary] text-sm font-semibold hover:text-[--color-primary-strong]">
                  Edit
                </button>
                <button onClick={() => handleDelete(p._id)} className="text-red-500 text-sm font-semibold hover:text-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Product Modal */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-[--color-border] shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[--color-border] p-4 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[--color-muted]">Edit Product</p>
                <h3 className="text-xl font-semibold text-[--foreground]">{editingProduct.name}</h3>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingProduct(null);
                }}
                className="text-[--color-muted] hover:text-[--foreground] text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-1">
                  <span className="text-sm font-medium">Name</span>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2"
                    value={editingProduct.name}
                    onChange={(e) => handleEditChange("name", e.target.value)}
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-medium">SKU</span>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2"
                    value={editingProduct.sku}
                    onChange={(e) => handleEditChange("sku", e.target.value.toUpperCase())}
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-medium">Category</span>
                  <select
                    className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2"
                    value={editingProduct.category}
                    onChange={(e) => handleEditCategoryChange(e.target.value)}
                  >
                    <option value="FRAME">Frame</option>
                    <option value="LENS">Lens</option>
                    <option value="GLASSES">Glasses</option>
                    <option value="HEARING_AID">Hearing Aid</option>
                    <option value="LENS_WATER">Lens Water</option>
                    <option value="ACCESSORY">Accessory</option>
                    <option value="SUNGLASS">Sun-glasses</option>
                    <option value="EYE_TESTING">Eye Testing</option>
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-medium">Cost Price</span>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2"
                    value={editingProduct.costPrice}
                    onChange={(e) => handleEditChange("costPrice", +e.target.value)}
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-medium">Selling Price</span>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2"
                    value={editingProduct.sellingPrice}
                    onChange={(e) => handleEditChange("sellingPrice", +e.target.value)}
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-medium">Stock Qty</span>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2"
                    value={editingProduct.stockQty}
                    onChange={(e) => handleEditChange("stockQty", +e.target.value)}
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-medium">Reorder Level</span>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2"
                    value={editingProduct.reorderLevel ?? 5}
                    onChange={(e) => handleEditChange("reorderLevel", +e.target.value)}
                  />
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 border-t border-[--color-border] bg-white p-4 flex gap-2 justify-end">
              <button
                className="rounded-lg border border-[--color-border] bg-white px-4 py-2 font-semibold text-[--color-muted] hover:text-[--foreground]"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingProduct(null);
                }}
              >
                Cancel
              </button>
              <button
                className="rounded-lg border border-[--color-primary] bg-[--color-primary] px-4 py-2 text-black font-semibold shadow hover:bg-[--color-primary-strong] disabled:opacity-60"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
