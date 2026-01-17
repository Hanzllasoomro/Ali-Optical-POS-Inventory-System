"use client";

type InvoiceItem = {
  name: string;
  desc?: string;
  qty: number;
  price: number;
};

type InvoiceType = {
  store: {
    name: string;
    tagline: string;
    address: string;
    phone: string;
  };
  order: {
    number: string;
    date: string;
    deliveryDate: string;
  };
  payment: {
    subtotal: number;
    discount: number;
    tax: number;
    paid: number;
    currency: string;
  };
  items: InvoiceItem[];
};

interface Props {
  invoice: InvoiceType;
}

function formatAmount(value: number, currency: string) {
  return `${currency} ${value.toLocaleString("en-PK")}`;
}

export default function Invoice({ invoice }: Props) {
  const subtotal = invoice.items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const total = subtotal - invoice.payment.discount + invoice.payment.tax;
  const balance = total - invoice.payment.paid;

  return (
    <div className="flex justify-center bg-transparent px-1 py-3 font-mono text-sm text-black">
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-sm sm:w-[380px] print:w-[80mm] print:shadow-none print:border print:border-zinc-200">
        <button
          type="button"
          onClick={() => window.print()}
          className="absolute right-3 top-3 rounded border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-700 shadow-sm transition hover:bg-zinc-100 print:hidden"
        >
          Print
        </button>

        <div className="border-b border-dashed border-zinc-300 p-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900">
            {invoice.store.name}
          </h1>
          <p className="text-xs text-zinc-1800">{invoice.store.tagline}</p>
          <p className="text-xs text-zinc-1500">{invoice.store.address}</p>
          <p className="text-xs text-zinc-1500">Ph: {invoice.store.phone}</p>
          <p className="text-xs text-zinc-1500"> tel: 0722 653994</p>
        </div>

        <div className="border-b border-dashed border-zinc-300 px-4 py-3">
          <div className="flex justify-between">
            <span className="font-semibold">Order</span>
            <span>{invoice.order.number}</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-zinc-1500">
            <span>Order Date:</span>
            <span className="text-right">{invoice.order.date}</span>
          </div>
        </div>

        <div className="border-b border-dashed border-zinc-300 px-4 py-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            <span className="w-40">Item</span>
            <span className="w-10 text-center">Qty</span>
            <span className="w-16 text-right">Price</span>
            <span className="w-20 text-right">Total</span>
          </div>

          <div className="mt-2 space-y-3">
            {invoice.items.map((item) => {
              const lineTotal = item.qty * item.price;
              return (
                <div
                  key={item.name}
                  className="border-b border-dashed border-zinc-200 pb-2 last:border-none last:pb-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-24">
                      <p className="text-sm font-semibold leading-5">
                        {item.name}
                      </p>
                      {item.desc ? (
                        <p className="text-[11px] leading-4 text-zinc-500">
                          {item.desc}
                        </p>
                      ) : null}
                    </div>
                    <span className="w-10 text-center text-sm">{item.qty}</span>
                    <span className="w-16 text-right text-sm">
                      {formatAmount(item.price, invoice.payment.currency)}
                    </span>
                    <span className="w-20 text-right text-sm font-semibold">
                      {formatAmount(lineTotal, invoice.payment.currency)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-b border-dashed border-zinc-300 px-4 py-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatAmount(subtotal, invoice.payment.currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Discount</span>
            <span>-{formatAmount(invoice.payment.discount, invoice.payment.currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>{formatAmount(invoice.payment.tax, invoice.payment.currency)}</span>
          </div>
          <div className="mt-2 flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatAmount(total, invoice.payment.currency)}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-zinc-1800">
            <span>Paid</span>
            <span>{formatAmount(invoice.payment.paid, invoice.payment.currency)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-zinc-900">
            <span>Balance</span>
            <span>{formatAmount(balance, invoice.payment.currency)}</span>
          </div>
        </div>

        <div className="px-4 py-3 text-center text-[11px] text-zinc-1800">
          <p>Thank you for choosing Ali Optical.</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-zinc-1800">
            Designed by hanzllasoomro.site
          </p>
        </div>
      </div>
    </div>
  );
}
