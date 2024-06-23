const asyncHandler = require('express-async-handler');
const paypal = require('../connector/paypal');
const checkoutMiddleware = require('../middlewares/checkout');

module.exports = {
  payment: asyncHandler(async (req, res) => {
    const {
      totalQuantity,
      totalPrice,
      paymentMethod,
      paymentId,
      cartData,
      userInfo,
    } = req?.body;

    const results = await checkoutMiddleware.checkoutCart({
      totalQuantity,
      totalPrice,
      paymentMethod,
      paymentId,
      cartData,
      userInfo,
    });
    
    console.log('results >> ', results);

    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
        payer_info: {
          email: userInfo?.userEmail,
          first_name: userInfo?.userName,
        },
      },
      redirect_urls: {
        return_url: `http://localhost:5005/paypal/success?totalPrice=${totalPrice}&orderId=${results?.orderId}`,
        cancel_url: `http://localhost:5005/paypal/cancel?orderId=${results?.orderId}`,
      },
      transactions: [
        {
          item_list: {
            items: cartData?.map((item) => {
              return {
                name: item?.productName,
                sku: item?.productId,
                price: item?.salePrice > 0 ? item?.salePrice : item?.price,
                currency: 'USD',
                quantity: item?.quantity,
              };
            }),
          },
          amount: {
            currency: 'USD',
            total: totalPrice,
          },
          description: 'checkout product',
        },
      ],
    };

    paypal.payment.create(create_payment_json, async function (error, payment) {
      if (error) {
        await checkoutMiddleware.backOrder(results?.orderId);
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            res.json({ redirectLink: payment.links[i].href });
          }
        }
      }
    });
  }),

  paymentSuccess: asyncHandler(async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const totalPrice = req.query.totalPrice;
    const orderId = req.query.orderId;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: 'USD',
            total: totalPrice, // Total amount in VND
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        if (error) {
          await checkoutMiddleware.backOrder(orderId);
          return res.redirect('http://localhost:3000/paypal/payment/cancel');
        } else {
          return res.redirect(
            `http://localhost:3000/paypal/payment/success?paymentId=${paymentId}`
          );
        }
      }
    );
  }),

  paymentCancel: asyncHandler(async (req, res) => {
    const orderId = req.query.orderId;
    await checkoutMiddleware.backOrder(orderId);
    try {
      return res.redirect('http://localhost:3000/paypal/payment/cancel');
    } catch (error) {
      console.log(error.message);
    }
  }),
};
