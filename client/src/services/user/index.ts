import {
  UserCreateBody,
  UserLoginBodyType,
  UserUpdateBody,
} from '../../types/user';
import axiosConfig from '../axiosConfig';

const URL = '/user';

export const userAPI = {
  userSignUp: async (signUpData: UserCreateBody) => {
    const response = await axiosConfig.post(`${URL}/signup`, { ...signUpData });
    return response;
  },

  userLogin: async (loginData: UserLoginBodyType) => {
    const response = await axiosConfig.post(`${URL}/login`, { ...loginData });
    return response;
  },

  getUserList: async () => {
    const response = await axiosConfig.get(`${URL}`);
    return response;
  },

  getUserById: async (userId: string) => {
    const response = await axiosConfig.get(`${URL}/${userId}`);
    return response;
  },

  updateUserInfo: async (userId: string, userData: UserUpdateBody) => {
    const response = await axiosConfig.put(`${URL}/${userId}`, {
      ...userData,
    });
    return response;
  },

  deleteUser: async (userId: string) => {
    const response = await axiosConfig.delete(`${URL}/${userId}`);
    return response;
  },

  updateUserStatus: (userId: string, status: boolean) => {
    return axiosConfig.patch(`${URL}/${userId}/status`, {
      status,
    });
  },

  updateUserPassword: (
    userId: string,
    body: { currentPassword: string; newPassword: string }
  ) => {
    return axiosConfig.patch(`${URL}/${userId}/password`, {
      ...body,
    });
  },

  sendOtpForgotPw: async (email: string) => {
    const response = await axiosConfig.post(`${URL}/forgot-password/send-otp`, {
      email,
    });
    return response;
  },

  verifyOtpForgotPw: async (data: {
    email: string;
    otp: string;
    password: string;
  }) => {
    const response = await axiosConfig.post(
      `${URL}/forgot-password/verify-otp`,
      {
        ...data,
      }
    );
    return response;
  },
};
