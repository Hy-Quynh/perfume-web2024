const VerifyCode = require('../models/verify-code');

module.exports = {
  deleteByEmail: async (email) => {
    try {
      const deleteRes = await VerifyCode.updateMany(
        { email },
        {
          $set: {
            isExpired: true,
          },
        }
      );

      if (deleteRes) {
        return {
          success: true,
        };
      }
      throw new Error('Xử lí thất bại');
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  createNewCode: async (code, email) => {
    try {
      const insertRes = await VerifyCode.insertMany([{ code, email }]);
      if (insertRes) {
        return {
          success: true,
        };
      }
      throw new Error('Thêm thất bại');
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  getCodeActiveByEmail: async (email) => {
    try {
      const code = await VerifyCode.findOne({ email, isExpired: false}).lean().exec();

      return {
        success: true,
        payload: code,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: err.message,
        },
      };
    }
  },
};
