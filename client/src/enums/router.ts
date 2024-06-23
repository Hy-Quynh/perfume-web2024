export enum ROUTER {
  LOGIN = '/login',
  REGISTER = '/register',
  FORGOT_PASSWORD = '/forgot-password',
  ADMIN = '/admin',
  ADMIN_LOGIN = '/admin/login',
  ADMIN_FORGOT_PASSWORD = '/admin/forgot-password',
  ADMIN_USER = '/admin/user',
  ADMIN_ROLE = '/admin/role',
  ADMIN_LIST = '/admin/list',
  ADMIN_BRAND = '/admin/brand',
  ADMIN_CATEGORY = '/admin/category',
  ADMIN_PRODUCT = '/admin/product',
  ADMIN_PRODUCT_COMMENT = '/admin/product/comment',
  ADMIN_POST = '/admin/post',
  ADMIN_ORDER = '/admin/order',
  HOMEPAGE = '/',
  POSTPAGE = '/post',
  POST_DETAIL = '/post/:postId',
  ABOUT_PAGE = '/about',
  PRODUCT_PAGE = '/product',
  PRODUCT_DETAIL = '/product/:productId',
  CART_PAGE = '/cart',
  PAYMENT_PAGE = '/payment',
  PERSONAL_PAGE = '/personal',
  PAYMENT_SUCCESS='/paypal/payment/success',
  PAYMENT_FAILED='/paypal/payment/cancel'
}