import { Outlet } from 'react-router-dom';
import Footer from '../../components/footer';
import Header from '../../components/header';
import { logOut, parseJSON } from '../../utils/handleData';
import { USER_INFO_KEY } from '../../constants';
import { useEffect } from 'react';

export default function ClientLayout() {
  let customerData = parseJSON(localStorage.getItem(USER_INFO_KEY), {});

  useEffect(() => {
    if (customerData?.isAdmin) {
      logOut();
    }
  }, []);
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
