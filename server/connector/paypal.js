const paypal = require('paypal-rest-sdk');

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "";

paypal.configure({
  mode: 'sandbox', // 'sandbox' or 'live'
  client_id: PAYPAL_CLIENT_ID,
  client_secret: PAYPAL_CLIENT_SECRET
});

module.exports = paypal;
