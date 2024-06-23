const Checkout = require('../models/checkout');
const Product = require('../models/product');

module.exports = {
  checkoutCart: async (checkoutData) => {
    try {
      const { totalQuantity, totalPrice, paymentMethod, cartData, userInfo } =
        checkoutData;

      let checkValid = true;

      for (
        let productIndex = 0;
        productIndex < cartData?.length;
        productIndex++
      ) {
        const product = await Product.findOne({
          _id: cartData?.[productIndex]?.productId,
        })
          .lean()
          .exec();

        if (product?.currentQuantity < cartData?.[productIndex]?.quantity) {
          checkValid = false;
          break;
        }
      }

      if (!checkValid) {
        throw new Error(
          'Số lượng sản phẩm trong giỏ hàng vượt quá số lượng hiện có'
        );
      }

      const inserProduct = await Checkout.insertMany([
        {
          totalQuantity,
          totalPrice,
          paymentMethod,
          productInfo: cartData,
          userInfo,
          deliveryStatus: paymentMethod === 'CARD' ? 'PAID' : 'ORDERED',
        },
      ]);

      if (inserProduct) {
        for (
          let productIndex = 0;
          productIndex < cartData?.length;
          productIndex++
        ) {
          await Product.updateOne(
            { _id: cartData?.[productIndex]?.productId },
            {
              $inc: {
                currentQuantity:
                  Number(cartData?.[productIndex]?.quantity) * -1,
              },
            }
          );
        }

        return {
          success: true,
          orderId: inserProduct?.[0]?._id,
        };
      }

      throw new Error('Xảy ra lỗi trong quá trình xử lí');
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  backOrder: async (orderId) => {
    try {
      const order = await Checkout.findOne({ _id: orderId }).lean().exec();

      for (
        let productIndex = 0;
        productIndex < order?.productInfo?.length;
        productIndex++
      ) {
        await Product.updateOne(
          { _id: order?.productInfo?.[productIndex]?.productId },
          {
            $inc: {
              currentQuantity: Number(
                order?.productInfo?.[productIndex]?.quantity
              ),
            },
          }
        );
      }

      await Checkout.deleteOne({ _id: orderId });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  getUserOrder: async (userId) => {
    try {
      const listOrder = await Checkout.find({ 'userInfo.userId': userId })
        .lean()
        .exec();

      if (listOrder) {
        return {
          success: true,
          order: [...listOrder],
        };
      }

      throw new Error('Lấy danh sách đơn hàng thất bại');
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  getOrderDetail: async (checkoutId) => {
    try {
      const listOrder = await Checkout.findOne({ _id: checkoutId })
        .lean()
        .exec();

      if (listOrder) {
        return {
          success: true,
          payload: { ...listOrder },
        };
      }

      throw new Error('Lấy danh sách đơn hàng thất bại');
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  changeOrderStatus: async (checkoutId, status) => {
    try {
      const res = await Checkout.findOneAndUpdate(
        { _id: checkoutId },
        {
          deliveryStatus: status,
        }
      );

      if (status === 'CANCEL') {
        for (
          let productIndex = 0;
          productIndex < res?.productInfo?.length;
          productIndex++
        ) {
          await Product.updateOne(
            { _id: res?.productInfo?.[productIndex]?.productId },
            {
              $inc: {
                currentQuantity: Number(
                  res?.productInfo?.[productIndex]?.quantity
                ),
              },
            }
          );
        }
      }

      if (res) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật thành công');
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  getAllOrder: async () => {
    try {
      const listOrder = await Checkout.find().lean().exec();

      if (listOrder) {
        return {
          success: true,
          order: listOrder,
        };
      }

      throw new Error('Lấy danh sách đơn hàng thất bại');
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  statisticOrder: async (startDate, endDate) => {
    try {
      const results = await Checkout.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
            isDelete: false, // Lọc ra các đơn hàng không bị xóa
            status: true, // Lọc ra các đơn hàng hợp lệ
          },
        },
        {
          $facet: {
            totalStats: [
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 }, // Đếm tổng số đơn hàng
                  totalCancelledOrders: {
                    $sum: {
                      $cond: [{ $eq: ['$deliveryStatus', 'CANCEL'] }, 1, 0],
                    },
                  }, // Đếm tổng số đơn hàng đã huỷ
                  totalRevenue: {
                    $sum: {
                      $cond: [
                        { $ne: ['$deliveryStatus', 'CANCEL'] },
                        '$totalPrice',
                        0,
                      ],
                    },
                  }, // Tính tổng doanh thu (loại bỏ đơn hàng đã huỷ)
                  orderCountsByStatus: {
                    $push: {
                      status: '$deliveryStatus',
                      count: 1,
                      revenue: {
                        $cond: [
                          { $ne: ['$deliveryStatus', 'CANCEL'] },
                          '$totalPrice',
                          0,
                        ],
                      },
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalOrders: 1,
                  totalCancelledOrders: 1,
                  totalRevenue: 1,
                  orderCountsByStatus: 1,
                },
              },
            ],
            productStats: [
              {
                $unwind: '$productInfo', // Làm phẳng mảng productInfo
              },
              {
                $group: {
                  _id: {
                    productId: '$productInfo.productId',
                    productName: '$productInfo.productName',
                  },
                  totalQuantity: { $sum: '$productInfo.quantity' },
                  totalRevenue: {
                    $sum: {
                      $cond: [
                        { $ne: ['$deliveryStatus', 'CANCEL'] },
                        {
                          $multiply: [
                            '$productInfo.quantity',
                            '$productInfo.orderPrice',
                          ],
                        },
                        0,
                      ],
                    },
                  },
                  statuses: {
                    $push: {
                      status: '$deliveryStatus',
                      totalQuantity: '$productInfo.quantity',
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  productId: '$_id.productId',
                  productName: '$_id.productName',
                  totalQuantity: 1,
                  totalRevenue: 1,
                  statuses: {
                    $map: {
                      input: '$statuses',
                      as: 'status',
                      in: {
                        status: {
                          $switch: {
                            branches: [
                              {
                                case: { $eq: ['$$status.status', 'PAID'] },
                                then: 'PAID',
                              },
                              {
                                case: { $eq: ['$$status.status', 'ORDERED'] },
                                then: 'ORDERED',
                              },
                              {
                                case: { $eq: ['$$status.status', 'DELIVERY'] },
                                then: 'DELIVERY',
                              },
                              {
                                case: { $eq: ['$$status.status', 'SHIPPED'] },
                                then: 'SHIPPED',
                              },
                              {
                                case: { $eq: ['$$status.status', 'CANCEL'] },
                                then: 'CANCEL',
                              },
                            ],
                            default: 'Unknown',
                          },
                        },
                        totalQuantity: '$$status.totalQuantity',
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        {
          $project: {
            totalOrders: { $arrayElemAt: ['$totalStats.totalOrders', 0] },
            totalCancelledOrders: {
              $arrayElemAt: ['$totalStats.totalCancelledOrders', 0],
            },
            totalRevenue: { $arrayElemAt: ['$totalStats.totalRevenue', 0] },
            orderCountsByStatus: {
              $arrayElemAt: ['$totalStats.orderCountsByStatus', 0],
            },
            products: '$productStats',
          },
        },
      ]);

      if (results) {
        return {
          success: true,
          payload: { ...results[0] },
        };
      }

      throw new Error('Lấy danh sách thống kê thất bại');
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },
};
