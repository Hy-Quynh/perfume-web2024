import { Route, Routes } from 'react-router-dom';
import { ROUTER } from '../enums/router';
import NotFoundPage from '../pages/notFoundPage';
import LoginPage from '../pages/login';
import RegisterPage from '../pages/register';
import ForgotPasswordPage from '../pages/forgotPassword';
import AdminPrivate from '../layouts/admin/PrivateLayout';
import ListAdmin from '../pages/admin/listAdmin/ListAdmin';
import AdminUser from '../pages/admin/user/ListUser';
import AdminBrand from '../pages/admin/brand/Brand';
import AdminCategory from '../pages/admin/category/Category';
import AdminDashboard from '../pages/admin/dashboard/Dashboard';
import AdminProduct from '../pages/admin/product/Product';
import ClientLayout from '../layouts/client/ClientLayout';
import HomePage from '../pages/client/homepage';
import ProductPage from '../pages/client/product';
import ProductDetail from '../pages/client/productDetail';
import CartPage from '../pages/client/cart';
import PersonalPage from '../pages/client/personalPage';
import PaymentPage from '../pages/client/payment';
import PaymentSuccess from '../pages/client/paypal/PaymentSuccess';
import PaymentFailed from '../pages/client/paypal/PaymentFailed';
import AdminOrder from '../pages/admin/order';

const arrRoutes = [
  { path: ROUTER.LOGIN, element: <LoginPage /> },
  { path: ROUTER.REGISTER, element: <RegisterPage /> },
  { path: ROUTER.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
  {
    path: ROUTER.ADMIN_LOGIN,
    element: <LoginPage isAdmin={true} />,
  },
  {
    path: ROUTER.ADMIN_FORGOT_PASSWORD,
    element: <ForgotPasswordPage isAdmin={true} />,
  },
  {
    path: ROUTER.PAYMENT_SUCCESS,
    element: <PaymentSuccess />,
  },
  {
    path: ROUTER.PAYMENT_FAILED,
    element: <PaymentFailed />,
  },
  {
    path: ROUTER.ADMIN,
    element: <AdminPrivate />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: ROUTER.ADMIN_LIST,
        element: <ListAdmin />,
      },
      {
        path: ROUTER.ADMIN_USER,
        element: <AdminUser />,
      },
      {
        path: ROUTER.ADMIN_BRAND,
        element: <AdminBrand />,
      },
      {
        path: ROUTER.ADMIN_CATEGORY,
        element: <AdminCategory />,
      },
      {
        path: ROUTER.ADMIN_PRODUCT,
        element: <AdminProduct />,
      },
      {
        path: ROUTER.ADMIN_ORDER,
        element: <AdminOrder />,
      },
    ],
  },
  {
    path: ROUTER.HOMEPAGE,
    element: <ClientLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTER.PRODUCT_PAGE,
        element: <ProductPage />,
      },
      {
        path: ROUTER.PRODUCT_DETAIL,
        element: <ProductDetail />,
      },
      {
        path: ROUTER.CART_PAGE,
        element: <CartPage />,
      },
      {
        path: ROUTER.PAYMENT_PAGE,
        element: <PaymentPage />,
      },
      {
        path: ROUTER.PERSONAL_PAGE,
        element: <PersonalPage />,
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
];

export const MainRouter = () => {
  const renderRoutes = (arrRoutes: any) => {
    return arrRoutes.map((item: any, index: number) => {
      const { path, element } = item;
      return (
        <Route key={index} path={path} element={element}>
          {item?.children?.map((it: any, id: number) => {
            return <Route key={`child-router-${id}`} {...it} />;
          }) || <></>}
        </Route>
      );
    });
  };

  return <Routes>{renderRoutes(arrRoutes)}</Routes>;
};
