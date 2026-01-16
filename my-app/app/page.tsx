import Invoice from "../components/Invoice";

const demoInvoice = {
  store: {
    name: "Ali Optical POS",
    tagline: "Frames • Lenses • Hearing Aids • Lens Water",
    address: "Tariq Road, Jacobabad, Sindh",
    phone: "+92 315 6018500",
  },
  order: {
    number: "INV-2026-0001",
    date: "2026-01-13",
    deliveryDate: "2026-01-14",
    customer: "Walk-in Customer",
    color: "#000000",
  },
  payment: {
    subtotal: 8200,
    discount: 500,
    tax: 0,
    paid: 5000,
    currency: "PKR",
  },
  items: [
    { name: "Frame - Classic Black", desc: "SKU: FRM-CL-001", qty: 1, price: 2800 },
    { name: "Lens - Blue Light (1.56)", desc: "Anti-glare, scratch resistant", qty: 1, price: 3200 },
    { name: "Hearing Aid Battery Pack", desc: "Size 312 • 6 pcs", qty: 2, price: 600 },
    { name: "Lens Water Cleaner", desc: "60ml spray", qty: 1, price: 500 },
  ],
};

export default function Home() {
  return <Invoice invoice={demoInvoice} />;
}
