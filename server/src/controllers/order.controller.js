import * as orderService from "../services/order.service.js";

export const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listOrders = async (req, res) => {
  try {
    const orders = await orderService.listOrders(req.query);
    res.status(200).json(orders);
  } catch {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
