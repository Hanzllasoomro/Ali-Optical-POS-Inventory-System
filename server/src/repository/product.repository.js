import Product from "../models/Product.model.js";

export const createProduct = (data) => {
  return Product.create(data);
};

export const findProductBySKU = (sku) => {
  return Product.findOne({ sku });
};

export const findProductById = (id) => {
  return Product.findById(id);
};

export const updateProduct = (id, data) => {
  return Product.findByIdAndUpdate(id, data, { new: true });
};

export const listProducts = ({ page, limit, category, search }) => {
  const query = { isActive: true };

  if (category) query.category = category;
  if (search)
    query.name = { $regex: search, $options: "i" };

  return Product.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
};
