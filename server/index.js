const express = require('express');
const session = require('express-session');
const cors = require('cors')
const connectToDB = require('./connector/mongoConnect');
const adminRouter = require('./routers/admin');
const userRouter = require('./routers/user');
const brandRouter = require('./routers/brand');
const categoryRouter = require('./routers/category');
const productRouter = require('./routers/product');
const checkoutRouter = require('./routers/checkout');
const paypalRouter = require('./routers/paypal');

require('dotenv').config();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;


const app = express();
const routerPublic = express.Router();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(session({ resave: true ,secret: '123456' , saveUninitialized: true}));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(cors())

routerPublic.use('/api/admin', adminRouter);
routerPublic.use('/api/user', userRouter);
routerPublic.use('/api/brand', brandRouter);
routerPublic.use('/api/category', categoryRouter);
routerPublic.use('/api/product', productRouter);
routerPublic.use('/api/checkout', checkoutRouter);
routerPublic.use('/paypal', paypalRouter);

app.use(routerPublic);

connectToDB();

app.listen(process.env.PORT || 5005, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
