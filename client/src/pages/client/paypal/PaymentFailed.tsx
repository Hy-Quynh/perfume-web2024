import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function PaymentFailed() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/');
    }, 1000);
  }, []);


  return (
    <div className='min-w-[100vw] min-h-[100vh] flex flex-col justify-center items-center'>
      <div className='p-[50px] bg-[red] text-white text-2xl rounded-[16px]'>THANH TOÁN THẤT BẠI</div>
    </div>
  )
}

export default PaymentFailed