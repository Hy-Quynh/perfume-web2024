const asyncHandler = require('express-async-handler');
const checkoutMiddleware = require('../middlewares/checkout');

module.exports = {
  checkoutCart: asyncHandler(async (req, res) => {
    const checkoutData = req.body;
    const results = await checkoutMiddleware.checkoutCart(checkoutData);
    res.json(results);
  }),

  getAllOrder: asyncHandler(async (req, res) => {
    const results = await checkoutMiddleware.getAllOrder();
    res.json(results);
  }),

  getUserOrder: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const results = await checkoutMiddleware.getUserOrder(userId);
    res.json(results);
  }),

  getOrderDetail: asyncHandler(async (req, res) => {
    const { checkoutId } = req.params;
    const results = await checkoutMiddleware.getOrderDetail(checkoutId);
    res.json(results);
  }),

  changeOrderStatus: asyncHandler(async (req, res) => {
    const { checkoutId } = req.params;
    const { status } = req.body;
    const results = await checkoutMiddleware.changeOrderStatus(
      checkoutId,
      status
    );
    res.json(results);
  }),

  statisticOrder: asyncHandler(async (req, res) => {
    const { startDate, endDate } = req?.query;
    const results = await checkoutMiddleware.statisticOrder(startDate, endDate);
    res.json(results);
  }),
};
