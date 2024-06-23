import axiosConfig from '../axiosConfig';

const URL = '/brand';

export const brandAPI = {
  getAllBrand: async (status?: boolean) => {
    const response = await axiosConfig.get(`${URL}?status=${status}`);
    return response;
  },

  getBrandById: async (brandId: number) => {
    const response = await axiosConfig.get(`${URL}/${brandId}`);
    return response;
  },

  addNewBrand: async (data: {name: string, image: string}) => {
    const response = await axiosConfig.post(`${URL}`, { ...data });
    return response;
  },

  deleteBrand: async (brandId: string) => {
    const response = await axiosConfig.delete(`${URL}/${brandId}`);
    return response;
  },

  updateBrand: async (brandId: string, data: {name: string, image: string}) => {
    const response = await axiosConfig.put(`${URL}/${brandId}`, {
      ...data,
    });
    return response;
  },

  updateBrandStatus: async (brandId: string, status: boolean) => {
    const response = await axiosConfig.patch(`${URL}/${brandId}/status`, {
      status,
    });
    return response;
  },
};
