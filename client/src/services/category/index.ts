import axiosConfig from '../axiosConfig';

const URL = '/category';

export const categoryAPI = {
  getAllCategory: async (status?: boolean) => {
    const response = await axiosConfig.get(`${URL}?status=${status}`);
    return response;
  },

  getCategoryById: async (categoryId: number) => {
    const response = await axiosConfig.get(`${URL}/${categoryId}`);
    return response;
  },

  addNewCategory: async (data: {name: string, image: string}) => {
    const response = await axiosConfig.post(`${URL}`, { ...data });
    return response;
  },

  deleteCategory: async (categoryId: string) => {
    const response = await axiosConfig.delete(`${URL}/${categoryId}`);
    return response;
  },

  updateCategory: async (categoryId: string, data: {name: string, image: string}) => {
    const response = await axiosConfig.put(`${URL}/${categoryId}`, {
      ...data,
    });
    return response;
  },

  updateCategoryStatus: async (categoryId: string, status: boolean) => {
    const response = await axiosConfig.patch(`${URL}/${categoryId}/status`, {
      status,
    });
    return response;
  },
};
