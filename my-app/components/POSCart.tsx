"use client";

import type { Dispatch, SetStateAction } from "react";

type Product = {
  _id: string;
  name: string;
  sellingPrice: number;
  stockQty: number;
};

type CartItem = Product & { qty: number };

interface Props {
  cartItems: CartItem[];
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
  discount: number;
  setDiscount: (value: number) => void;
  currency?: string;
  onCheckout?: () => void;
  checkoutLabel?: string;
  showActions?: boolean;
  className?: string;
}

export default function POSCart({
  cartItems,
  setCartItems,
  discount,
  setDiscount,
  currency = "PKR",
  onCheckout,
  checkoutLabel = "Checkout",
  showActions = false,
  className = "",
}: Props) {
  const formatMoney = (value: number) => `${currency} ${value.toLocaleString()}`;

  const updateQty = (id: string, qty: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, qty: Math.min(Math.max(qty, 1), item.stockQty) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.sellingPrice * item.qty, 0);
  const total = Math.max(0, subtotal - discount);

  const handleDiscountChange = (value: number) => {
    const safe = Math.max(0, Math.min(value, subtotal));
    setDiscount(safe);
  };

  return (
    <div className={`rounded-2xl border border-[--color-border] bg-white p-4 shadow-sm space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[--color-muted]">Cart</p>
          <h2 className="text-xl font-semibold text-[--foreground]">Billing slip</h2>
        </div>
        <span className="rounded-full bg-[--color-primary]/10 text-[--color-primary-strong] px-3 py-1 text-sm font-semibold">
          {cartItems.length} items
        </span>
      </div>

      <div className="space-y-3">
        {cartItems.length === 0 && (
          <div className="rounded-xl border border-dashed border-[--color-border] bg-[--background] p-4 text-center text-[--color-muted]">
            Scan or tap products to add them here.
          </div>
        )}

        {cartItems.map((item) => (
          <div
            key={item._id}
            className="rounded-xl border border-[--color-border] bg-[--surface] px-3 py-2 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-[--foreground] leading-tight">{item.name}</p>
                <p className="text-xs text-[--color-muted]">Stock {item.stockQty}</p>
              </div>
              <button
                onClick={() => removeItem(item._id)}
                className="text-xs font-semibold text-red-500 hover:text-red-600"
                aria-label={`Remove ${item.name}`}
              >
                Remove
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 rounded-full border border-[--color-border] bg-white px-2 py-1 shadow-inner">
                <button
                  onClick={() => updateQty(item._id, item.qty - 1)}
                  disabled={item.qty <= 1}
                  className="h-8 w-8 rounded-full bg-[--background] text-lg font-semibold text-[--foreground] disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  value={item.qty}
                  min={1}
                  max={item.stockQty}
                  onChange={(e) => updateQty(item._id, +e.target.value)}
                  className="w-14 text-center text-sm font-semibold text-[--foreground] bg-transparent outline-none"
                />
                <button
                  onClick={() => updateQty(item._id, item.qty + 1)}
                  disabled={item.qty >= item.stockQty}
                  className="h-8 w-8 rounded-full bg-[--color-primary] text-white text-lg font-semibold disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-[--foreground]">{formatMoney(item.sellingPrice * item.qty)}</p>
                <p className="text-[11px] text-[--color-muted]">{formatMoney(item.sellingPrice)} each</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[--color-border] pt-3 space-y-2 text-sm">
        <div className="flex justify-between text-[--color-muted]">
          <span>Subtotal</span>
          <span className="font-semibold text-[--foreground]">{formatMoney(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[--color-muted]">Discount</span>
          <input
            type="number"
            value={discount}
            min={0}
            onChange={(e) => handleDiscountChange(+e.target.value)}
            className="w-28 rounded-lg border border-[--color-border] bg-white px-3 py-2 text-right font-semibold text-[--foreground] outline-none"
          />
        </div>

        <div className="flex justify-between text-base font-semibold text-[--foreground]">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>

        {showActions && onCheckout && (
          <button
            type="button"
            onClick={onCheckout}
            className="mt-2 w-full rounded-xl bg-[--color-primary] px-4 py-3 text-black font-semibold shadow-sm transition hover:bg-[--color-primary-strong]"
          >
            {checkoutLabel}
          </button>
        )}
      </div>
    </div>
  );
}
