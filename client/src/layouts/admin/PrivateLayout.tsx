import { Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { parseJSON } from '../../utils/handleData';
import { USER_INFO_KEY } from '../../constants';

const AdminPrivate = () => {
  let customerData = parseJSON(localStorage.getItem(USER_INFO_KEY), {});

  return customerData?.isAdmin ? (
    <AdminLayout />
  ) : (
    <Navigate to='/admin/login' />
  );
};

export default AdminPrivate;
