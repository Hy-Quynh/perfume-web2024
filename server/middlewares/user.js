const bcrypt = require('bcryptjs');
const SALT_ROUND = 10;
const User = require('../models/user');
const VerifyCodeMiddleware = require('../middlewares/verify-code');
const mailConfig = require('../connector/mail.config');
const { helpers } = require('../helpers');

module.exports = {
  userSignUp: async (email, phone, password) => {
    try {
      const checkExist = await User.findOne({
        email,
        isDelete: false,
      })
        .lean()
        .exec();

      if (!checkExist?._id) {
        const hashPassword = bcrypt.hashSync(password, SALT_ROUND);
        const insertAccount = await User.insertMany([
          {
            phone,
            email,
            password: hashPassword,
          },
        ]);

        if (insertAccount?.[0]?._id) {
          return {
            success: true,
          };
        }
      } else {
        throw new Error('Email đã tồn tại');
      }
    } catch (err) {
      return {
        success: false,
        error: {
          message: err.message,
        },
      };
    }
  },

  userLogin: async (email, password) => {
    try {
      const checkExist = await User.findOne({
        email,
        isDelete: false,
      })
        .lean()
        .exec();

      if (checkExist?._id) {
        if (!checkExist?.status) {
          throw new Error('Tài khoản bị vô hiệu hoá');
        }

        if (bcrypt.compareSync(password, checkExist?.password)) {
          return {
            success: true,
            payload: {
              _id: checkExist?._id,
              email: checkExist?.email,
              name: checkExist?.name,
              phone: checkExist?.phone,
            },
          };
        } else {
          throw new Error('Sai mật khẩu');
        }
      } else {
        throw new Error('Thông tin đăng nhập không chính xác');
      }
    } catch (err) {
      return {
        success: false,
        error: {
          message: err.message,
        },
      };
    }
  },

  getAllUser: async () => {
    try {
      const userRes = await User.find({ isDelete: false }).lean().exec();

      return {
        success: true,
        payload: {
          user: userRes,
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          message: err.message,
        },
      };
    }
  },

  getUserById: async (userId) => {
    try {
      const userRes = await User.findOne({ _id: userId }).lean().exec();

      return {
        success: true,
        payload: userRes,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          message: err.message,
        },
      };
    }
  },

  updateUserInfo: async (userId, name, email, phone, address) => {
    try {
      const checkExist = await User.findOne({
        email,
        isDelete: false,
      })
        .lean()
        .exec();

      if (
        checkExist?._id &&
        userId?.toString() !== checkExist?._id?.toString()
      ) {
        throw new Error('Email đã tồn tại');
      }

      const updateRes = await User.findOneAndUpdate(
        { _id: userId },
        {
          name,
          email,
          phone,
          address,
        }
      );
      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Không thể cập nhật thông tin người dùng');
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  deleteUserId: async (userId) => {
    try {
      const deleteProductReview = await User.findOneAndUpdate(
        { _id: userId },
        {
          isDelete: true,
        }
      );

      if (deleteProductReview) {
        return {
          success: true,
        };
      }
      throw new Error('Kiểm tra các thông tin ràng buộc khác của người dùng');
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },
  updateUserStatus: async (userId, status) => {
    try {
      const updateRes = await User.findOneAndUpdate(
        { _id: userId },
        {
          status,
        }
      );
      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Không thể cập nhật thông tin người dùng');
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  updateUserPassword: async (userId, currentPassword, newPassword) => {
    try {
      const userInfo = await User.findOne({
        _id: userId,
      })
        .lean()
        .exec();

      if (bcrypt.compareSync(currentPassword, userInfo?.password)) {
        const hashPassword = bcrypt.hashSync(newPassword, SALT_ROUND);
        const updateRes = await User.findOneAndUpdate(
          { _id: userId },
          {
            password: hashPassword,
          }
        );
        if (updateRes) {
          return {
            success: true,
          };
        }
      } else {
        throw new Error('Mật khẩu cũ không chính xác');
      }

      throw new Error('Cập nhật mật khẩu thất bại');
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  sendForgotPasswordCode: async (email) => {
    try {
      const checkExist = await User.findOne({
        email,
        isDelete: false,
      })
        .lean()
        .exec();


      if (!checkExist?._id) {
        throw new Error('Email không tồn tại');
      }

      const verifyCode = helpers.generateVerifyCode(6);

      const mail = {
        to: email,
        subject: 'Thay đổi mật khẩu',
        html: mailConfig.htmlResetPassword(verifyCode),
      };

      await VerifyCodeMiddleware.deleteByEmail(email);
      await VerifyCodeMiddleware.createNewCode(verifyCode, email);

      const result = await mailConfig.sendEmail(mail);
      if (result) {
        return {
          success: true,
        };
      }
      throw new Error('Gửi mã xác thực thất bại.');
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  verifyOtp: async (email, otp, password) => {
    try {
      const res = await VerifyCodeMiddleware.getCodeActiveByEmail(email);
      if (!res?.payload?.email) {
        throw new Error('Mã xác thực không tồn tại');
      }

      const { code, createdAt } = res?.payload;
      if (code !== otp) {
        throw new Error('Mã xác thực không tồn tại');
      }

      const now = Date.now();

      if (now - createdAt > 2 * 60 * 1000) {
        //2phút
        throw new Error('Mã xác thực hết hiệu lực');
      }

      const hashPassword = bcrypt.hashSync(password, SALT_ROUND);
      const updateRes = await User.findOneAndUpdate(
        { email },
        {
          password: hashPassword,
        }
      );

      if (updateRes) {
        return {
          success: true,
        };
      }
      throw new Error('Thay đổi mật khẩu thất bại');
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },
};
