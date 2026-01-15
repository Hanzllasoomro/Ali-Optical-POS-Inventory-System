import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import { generateInvoiceNumber } from "../utils/invoice.util.js";

// Note: Using single-node Mongo? Transactions need a replica set. This code avoids transactions to stay compatible.
export const createOrder = async ({
  customerName,
  deliveryDate,
  items,
  discount = 0,
  paidAmount,
  userId,
}) => {
  let subtotal = 0;

  // Stock check + deduction (sequential without transactions for single-node deployments)
  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product || product.stockQty < item.qty)
      throw new Error(`Insufficient stock for ${item?.name || "item"}`);

    product.stockQty -= item.qty;
    await product.save();

    subtotal += item.qty * item.price;
  }

  const total = subtotal - discount;
  const balanceAmount = total - paidAmount;

  const paymentStatus =
    balanceAmount <= 0
      ? "PAID"
      : paidAmount > 0
      ? "PARTIAL"
      : "UNPAID";

  const orderNumber = await generateInvoiceNumber(Order);

  const order = await Order.create({
    orderNumber,
    customerName,
    deliveryDate,
    items,
    subtotal,
    discount,
    total,
    paidAmount,
    balanceAmount,
    paymentStatus,
    createdBy: userId,
  });

  return order;
};
