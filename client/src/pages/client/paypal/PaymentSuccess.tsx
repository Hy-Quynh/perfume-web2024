import React, { useEffect } from 'react';
import { USER_CART_INFO, USER_INFO_KEY } from '../../../constants';
import { parseJSON } from '../../../utils/handleData';
import { useNavigate } from 'react-router-dom';

function PaymentSuccess() {
  const userData = parseJSON(localStorage.getItem(USER_INFO_KEY), {});
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem(USER_CART_INFO + `_${userData?._id || ''}`);

    setTimeout(() => {
      navigate('/');
    }, 1000);
  }, []);

  return (
    <div className='min-w-[100vw] min-h-[100vh] flex flex-col justify-center items-center'>
      <div className='p-[50px] bg-[#1677FF] text-white text-2xl rounded-[16px]'>
        THANH TOÁN THÀNH CÔNG
      </div>
    </div>
  );
}

export default PaymentSuccess;
