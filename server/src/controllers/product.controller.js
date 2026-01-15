import * as productService from "../services/product.service.js";

export const createProduct = async (req, res) => {
  try {
    const product = await productService.addProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listProducts = async (req, res) => {
  try {
    const products = await productService.getProducts(req.query);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adjustStock = async (req, res) => {
  try {
    const { qtyChange } = req.body;
    const product = await productService.updateStock(
      req.params.id,
      qtyChange
    );
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
