import Order from "../models/Order.model.js";

export const createOrder = (data, session) => {
  return Order.create([data], { session });
};

export const listOrders = ({ from, to }) => {
  const query = {};

  if (from || to) {
    query.orderDate = {};
    if (from) query.orderDate.$gte = from;
    if (to) query.orderDate.$lte = to;
  }

  return Order.find(query).sort({ createdAt: -1 });
};
