const Brand = require('../models/brand');

module.exports = {
  getAllBrand: async (status) => {
    try {
      const query = {isDelete: false}
      if (status !== 'undefined') {
        query.status = status
      }

      const brandRes = await Brand.find(query).lean().exec();

      return {
        success: true,
        payload: {
          brand: brandRes,
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

  getBrandById: async (brandId) => {
    try {
      const brandRes = await Brand.findOne({ _id: brandId }).lean().exec();

      return {
        success: true,
        payload: brandRes,
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

  addNewBrand: async (name, image) => {
    try {
      const addRes = await Brand.insertMany([{ name, image }]);

      if (addRes) {
        return {
          success: true,
        };
      }
      throw new Error('Thêm thương hiệu thất bại');
      
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  updateBrandInfo: async (brandId, name, image) => {
    try {
      const checkExist = await Brand.findOne({
        name,
        isDelete: false,
      })
        .lean()
        .exec();

      if (
        checkExist?._id &&
        brandId?.toString() !== checkExist?._id?.toString()
      ) {
        throw new Error('Tên thương hiệu đã tồn tại');
      }

      const updateRes = await Brand.findOneAndUpdate(
        { _id: brandId },
        {
          name,
          image,
        }
      );

      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Không thể cập nhật thông tin thương hiệu');
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

  deleteBrand: async (brandId) => {
    try {
      const deleteProductReview = await Brand.findOneAndUpdate(
        { _id: brandId },
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

  updateBrandStatus: async (brandId, status) => {
    try {
      const updateRes = await Brand.findOneAndUpdate(
        { _id: brandId },
        {
          status,
        }
      );
      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Không thể cập nhật thông tin thương hiệu');
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
};
