import { CheckoutBody, OrderStatusType } from '../../types/checkout';
import axiosConfig from '../axiosConfig';

const URL = '/checkout';

export const checkoutAPI = {
  checkoutCart: async (checkoutData: CheckoutBody) => {
    const response = await axiosConfig.post(`${URL}`, { ...checkoutData });
    return response;
  },

  getAllOrder: async () => {
    const response = await axiosConfig.get(`${URL}`);
    return response;
  },

  getUserOrder: async (userId: string) => {
    const response = await axiosConfig.get(`${URL}/user/${userId}`);
    return response;
  },

  getOrderDetail: async (checkoutId: string) => {
    const response = await axiosConfig.get(`${URL}/${checkoutId}`);
    return response;
  },

  changeOrderStatus: async (checkoutId: string, status: OrderStatusType) => {
    const response = await axiosConfig.put(`${URL}/${checkoutId}/status`, {
      status,
    });
    return response;
  },

  statisticOrder: async (startDate: string, endDate: string) => {
    const response = await axiosConfig.get(
      `${URL}/statistic?startDate=${startDate}&endDate=${endDate}`
    );
    return response;
  },
};
