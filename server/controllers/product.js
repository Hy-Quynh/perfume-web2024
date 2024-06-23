const asyncHandler = require('express-async-handler');
const productMiddleware = require('../middlewares/product');

module.exports = {
  getAllProduct: asyncHandler(async (req, res) => {
    const { limit, offset, search, brand, category, min, max, status } = req.query;
    const results = await productMiddleware.getAllProduct(
      limit,
      offset,
      search,
      brand,
      category,
      min,
      max,
      status
    );
    res.json(results);
  }),

  getBestSellingProduct: asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const results = await productMiddleware.getBestSellingProduct(limit);
    res.json(results);
  }),

  getProductById: asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const results = await productMiddleware.getProductById(productId);
    res.json(results);
  }),

  addNewProduct: asyncHandler(async (req, res) => {
    const {
      name,
      image,
      brandId,
      categoryId,
      description,
      price,
      salePrice,
      initQuantity,
    } = req.body;

    const results = await productMiddleware.addNewProduct(
      name,
      image,
      brandId,
      categoryId,
      description,
      price,
      salePrice,
      initQuantity
    );
    res.json(results);
  }),

  deleteProduct: asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const results = await productMiddleware.deleteProduct(productId);
    res.json(results);
  }),

  updateProduct: asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const {
      name,
      image,
      brandId,
      categoryId,
      description,
      price,
      salePrice,
      initQuantity,
    } = req.body;

    const results = await productMiddleware.updateProduct(
      productId,
      name,
      image,
      brandId,
      categoryId,
      description,
      price,
      salePrice,
      initQuantity
    );
    res.json(results);
  }),

  updateProductStatus: asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { status } = req.body;
    const results = await productMiddleware.updateProductStatus(
      productId,
      status
    );
    res.json(results);
  }),
};
