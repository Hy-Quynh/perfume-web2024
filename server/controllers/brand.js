const asyncHandler = require('express-async-handler');
const brandMiddleware = require('../middlewares/brand');

module.exports = {
  getAllBrand: asyncHandler(async (req, res) => {
    const {status} = req?.query
    const results = await brandMiddleware.getAllBrand(status);
    res.json(results);
  }),

  getBrandById: asyncHandler(async (req, res) => {
    const { brandId } = req.params;
    const results = await brandMiddleware.getBrandById(brandId);
    res.json(results);
  }),

  addNewBrand: asyncHandler(async (req, res) => {
    const { name, image } = req.body;
    const results = await brandMiddleware.addNewBrand(name, image);
    res.json(results);
  }),

  deleteBrand: asyncHandler(async (req, res) => {
    const { brandId } = req.params;
    const results = await brandMiddleware.deleteBrand(brandId);
    res.json(results);
  }),

  updateBrand: asyncHandler(async (req, res) => {
    const { brandId } = req.params;
    const { name, image } = req.body;
    const results = await brandMiddleware.updateBrandInfo(
      brandId,
      name,
      image
    );
    res.json(results);
  }),

  updateBrandStatus: asyncHandler(async (req, res) => {
    const { brandId } = req.params;
    const { status } = req.body;
    const results = await brandMiddleware.updateBrandStatus(brandId, status);
    res.json(results);
  }),
};
