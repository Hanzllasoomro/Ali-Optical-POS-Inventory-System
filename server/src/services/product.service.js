import * as productRepo from "../repository/product.repository.js";

export const addProduct = async (data) => {
  const existing = await productRepo.findProductBySKU(data.sku);
  if (existing) throw new Error("SKU already exists");

  return productRepo.createProduct(data);
};

export const updateProduct = async (productId, data) => {
  const product = await productRepo.findProductById(productId);
  if (!product) throw new Error("Product not found");

  // Check if SKU is being changed and if new SKU already exists
  if (data.sku && data.sku !== product.sku) {
    const existing = await productRepo.findProductBySKU(data.sku);
    if (existing) throw new Error("SKU already exists");
  }

  return productRepo.updateProduct(productId, data);
};

export const updateStock = async (productId, qtyChange) => {
  const product = await productRepo.findProductById(productId);
  if (!product) throw new Error("Product not found");

  const newQty = product.stockQty + qtyChange;
  if (newQty < 0) throw new Error("Insufficient stock");

  product.stockQty = newQty;
  await product.save();

  return product;
};

export const getProducts = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;

  return productRepo.listProducts({
    page,
    limit,
    category: query.category,
    search: query.search,
  });
};
