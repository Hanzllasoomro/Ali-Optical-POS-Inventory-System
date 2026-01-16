"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import POSCart from "../../components/POSCart";
import Invoice from "../../components/Invoice";
import { type Product, type CartItem, type Category } from "../../types";

const CATEGORY_OPTIONS: { label: string; value: Category | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Frame", value: "FRAME" },
  { label: "Lens", value: "LENS" },
  { label: "Glasses", value: "GLASSES" },
  { label: "Hearing Aid", value: "HEARING_AID" },
  { label: "Lens Water", value: "LENS_WATER" },
  { label: "Accessory", value: "ACCESSORY" },
  { label: "Sunglass", value: "SUNGLASS" },
];

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "ALL">(
    "ALL"
  );
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [customerName, setCustomerName] = useState("walk-in");
  const [color, setColor] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.sellingPrice * item.qty, 0),
    [cartItems]
  );
  const totalQty = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.qty, 0),
    [cartItems]
  );
  const totalDue = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount]);
  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase();
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(term);
      const matchesCategory =
        selectedCategory === "ALL" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  useEffect(() => {
    setPaidAmount((prev) => {
      const clamped = Math.min(Math.max(prev, 0), totalDue);
      return Number.isFinite(clamped) ? clamped : 0;
    });
  }, [totalDue]);

  useEffect(() => {
    setLoadingProducts(true);
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .finally(() => setLoadingProducts(false));
  }, []);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((c) => c._id === product._id);
      if (existing) {
        return prev.map((c) =>
          c._id === product._id
            ? { ...c, qty: Math.min(c.qty + 1, product.stockQty) }
            : c
        );
      }
      return [...prev, { ...product, qty: 1, category: product.category }];
    });
  };

  const handleCheckout = async () => {
    if (!cartItems.length) return alert("Cart is empty");

    setProcessing(true);

    try {
      const safePaid = Math.min(Math.max(paidAmount, 0), totalDue);

      const orderPayload = {
        customerName,
        color,
        deliveryDate: new Date().toISOString().slice(0, 10),
        discount,
        paidAmount: safePaid,
        items: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          qty: item.qty,
          price: item.sellingPrice,
        })),
      };

      const res = await api.post("/orders", orderPayload);

        const rawItems = Array.isArray(res.data.items) && res.data.items.length
          ? res.data.items
          : orderPayload.items;

        const invoiceItems = (rawItems ?? [])
          .filter(Boolean)
          .map((item: any) => ({
            name: item?.name ?? "Item",
            desc: item?.desc,
            qty: item?.qty ?? 1,
            price: item?.price ?? 0,
          }));

        setInvoiceData({
          store: {
            name: "Ali Optical POS",
            tagline: "Frames • Lenses • Hearing Aids • Sun-Glasses",
            address: "Tariq Road, Jacobabad, Sindh",
            phone: "+92 315 6018500",
          },
          order: {
            number: res.data.orderNumber,
            date: (res.data.orderDate || new Date().toISOString()).slice(0, 10),
            deliveryDate: res.data.deliveryDate || res.data.orderDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
            color: res.data.color || color || "N/A",
          },
          payment: {
            subtotal: res.data.subtotal ?? subtotal,
            discount: res.data.discount ?? discount,
            tax: 0,
            paid: res.data.paidAmount ?? paidAmount,
            currency: "PKR",
          },
          items: invoiceItems,
        });

      setCartItems([]);
      setDiscount(0);
      setColor("");
      setPaidAmount(0);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Checkout failed. Please try again.";
      alert(message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print:hidden">
        <div className="rounded-2xl bg-[--surface] border border-[--color-border] p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-[--color-muted]">Today</p>
          <p className="text-2xl font-semibold text-[--foreground]">{totalQty} items</p>
          <p className="text-sm text-[--color-muted]">In current cart</p>
        </div>
        <div className="rounded-2xl bg-[--surface] border border-[--color-border] p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-[--color-muted]">Subtotal</p>
          <p className="text-2xl font-semibold text-[--foreground]">PKR {subtotal.toLocaleString()}</p>
          <p className="text-sm text-[--color-muted]">Before discounts</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-[--color-primary] to-[--color-primary-strong] text-black p-4 shadow-lg">
          <p className="text-xs uppercase tracking-[0.2em] opacity-80">Checkout</p>
          <p className="text-2xl font-semibold">Receipt-ready</p>
          <p className="text-sm opacity-80">Print a 80mm thermal slip instantly.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <section className="col-span-12 lg:col-span-8 space-y-3 print:hidden">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 rounded-xl border border-[--color-border] bg-white px-3 py-2 shadow-sm">
              <span className="text-[--color-muted] text-sm">Search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Frame, lens, accessory..."
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="group rounded-2xl border border-[--color-border] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="text-lg font-semibold text-[--foreground] leading-tight">{p.name}</h3>
                    <p className="text-xs text-[--color-muted]">Stock: {p.stockQty}</p>
                  </div>
                  <span className="flex-none self-start rounded-full bg-[--color-primary]/10 text-[--color-primary-strong] px-2 py-1 text-xs font-semibold">
                    PKR {p.sellingPrice}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-end">
                  <button
                    onClick={() => addToCart(p)}
                    className="rounded-full bg-[--color-primary] px-4 py-2 text-black font-semibold shadow-sm transition hover:bg-[--color-primary-strong]"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
            {!filteredProducts.length && !loadingProducts && (
              <div className="col-span-full rounded-xl border border-dashed border-[--color-border] bg-white p-6 text-center text-[--color-muted]">
                Nothing matches "{search}" yet.
              </div>
            )}
          </div>
        </section>

        <section className="col-span-12 lg:col-span-4 space-y-3">
          {!invoiceData ? (
            <POSCart
              cartItems={cartItems}
              setCartItems={setCartItems}
              discount={discount}
              setDiscount={setDiscount}
            />
          ) : (
            <div className="rounded-2xl border border-[--color-border] bg-white shadow-sm p-3 print:border-none print:shadow-none print:bg-white print:p-0">
              <Invoice invoice={invoiceData} />
              <div className="mt-3 flex justify-between gap-2 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="flex-1 rounded-lg bg-[--color-primary] px-4 py-2 text-white font-semibold shadow-sm hover:bg-[--color-primary-strong]"
                >
                  Print again
                </button>
                <button
                  onClick={() => setInvoiceData(null)}
                  className="flex-1 rounded-lg border border-[--color-border] px-4 py-2 font-semibold text-[--foreground] hover:bg-[--color-border]/50"
                >
                  New sale
                </button>
              </div>
            </div>
          )}

          {cartItems.length > 0 && !invoiceData && (
            <div className="space-y-3 print:hidden">
              <div className="space-y-2 rounded-2xl border border-[--color-border] bg-white p-3 shadow-sm">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[--foreground]">Customer name</label>
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="walk-in"
                    className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2 text-[--foreground] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[--foreground]">Color</label>
                  <input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g., Black"
                    className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2 text-[--foreground] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[--foreground]">Amount paid</label>
                  <input
                    type="number"
                    min={0}
                    max={totalDue}
                    value={paidAmount}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      const safe = Math.min(Math.max(Number.isFinite(next) ? next : 0, 0), totalDue);
                      setPaidAmount(safe);
                    }}
                    className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2 text-[--foreground] outline-none"
                  />
                  <p className="text-xs text-[--color-muted]">Due now: PKR {totalDue.toLocaleString()}</p>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={processing}
                className="w-full rounded-xl bg-[--color-primary] px-4 py-3 text-black font-semibold shadow-sm transition hover:bg-[--color-primary-strong] disabled:opacity-60"
              >
                {processing ? "Processing..." : "Checkout & Print"}
              </button>
              <button
                onClick={() => {
                  setCartItems([]);
                  setDiscount(0);
                }}
                className="w-full rounded-xl border border-[--color-border] bg-white px-4 py-3 font-semibold text-[--color-muted] hover:text-[--foreground] hover:bg-[--color-border]/60"
              >
                Clear cart
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
