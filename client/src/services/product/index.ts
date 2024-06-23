import { ProductBody } from '../../types/product';
import axiosConfig from '../axiosConfig';

const URL = '/product';

export const productAPI = {
  getAllProduct: async (
    limit?: number,
    offset?: number,
    search?: string,
    brand?: string,
    category?: string,
    min?: number,
    max?: number,
    status?: boolean
  ) => {
    const response = await axiosConfig.get(
      `${URL}?limit=${limit}&offset=${offset}&search=${search}&brand=${brand}&category=${category}&min=${min}&max=${max}&status=${status}`
    );
    return response;
  },

  getBestSellingProduct: async (limit?: number) => {
    const response = await axiosConfig.get(`${URL}/best-selling?limit=${limit}`);
    return response;
  },

  getProductById: async (productId: string) => {
    const response = await axiosConfig.get(`${URL}/${productId}`);
    return response;
  },

  addNewProduct: async (data: ProductBody) => {
    const response = await axiosConfig.post(`${URL}`, { ...data });
    return response;
  },

  deleteProduct: async (productId: string) => {
    const response = await axiosConfig.delete(`${URL}/${productId}`);
    return response;
  },

  updateProduct: async (productId: string, data: ProductBody) => {
    const response = await axiosConfig.put(`${URL}/${productId}`, {
      ...data,
    });
    return response;
  },

  updateProductStatus: async (productId: string, status: boolean) => {
    const response = await axiosConfig.patch(`${URL}/${productId}/status`, {
      status,
    });
    return response;
  },
};
