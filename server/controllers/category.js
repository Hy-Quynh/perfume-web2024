const asyncHandler = require('express-async-handler');
const categoryMiddleware = require('../middlewares/category');

module.exports = {
  getAllCategory: asyncHandler(async (req, res) => {
    const {status} = req?.query
    const results = await categoryMiddleware.getAllCategory(status);
    res.json(results);
  }),

  getCategoryById: asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const results = await categoryMiddleware.getCategoryById(categoryId);
    res.json(results);
  }),

  addNewCategory: asyncHandler(async (req, res) => {
    const { name, image } = req.body;
    const results = await categoryMiddleware.addNewCategory(name, image);
    res.json(results);
  }),

  deleteCategory: asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const results = await categoryMiddleware.deleteCategory(categoryId);
    res.json(results);
  }),

  updateCategory: asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { name, image } = req.body;
    const results = await categoryMiddleware.updateCategoryInfo(
      categoryId,
      name,
      image
    );
    res.json(results);
  }),

  updateCategoryStatus: asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { status } = req.body;
    const results = await categoryMiddleware.updateCategoryStatus(categoryId, status);
    res.json(results);
  }),
};
