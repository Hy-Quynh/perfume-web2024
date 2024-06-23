const Category = require('../models/category');

module.exports = {
  getAllCategory: async (status) => {
    try {
      const query = {isDelete: false}
      if (status !== 'undefined') {
        query.status = status
      }

      const categoryRes = await Category.find(query).lean().exec();

      return {
        success: true,
        payload: {
          category: categoryRes,
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

  getCategoryById: async (categoryId) => {
    try {
      const categoryRes = await Category.findOne({ _id: categoryId }).lean().exec();

      return {
        success: true,
        payload: categoryRes,
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

  addNewCategory: async (name, image) => {
    try {
      const addRes = await Category.insertMany([{ name, image }]);

      if (addRes) {
        return {
          success: true,
        };
      }
      throw new Error('Thêm danh mục thất bại');
      
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  updateCategoryInfo: async (categoryId, name, image) => {
    try {
      const checkExist = await Category.findOne({
        name,
        isDelete: false,
      })
        .lean()
        .exec();

      if (
        checkExist?._id &&
        categoryId?.toString() !== checkExist?._id?.toString()
      ) {
        throw new Error('Tên danh mục đã tồn tại');
      }

      const updateRes = await Category.findOneAndUpdate(
        { _id: categoryId },
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
        throw new Error('Không thể cập nhật thông tin danh mục');
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

  deleteCategory: async (categoryId) => {
    try {
      const deleteProductReview = await Category.findOneAndUpdate(
        { _id: categoryId },
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

  updateCategoryStatus: async (categoryId, status) => {
    try {
      const updateRes = await Category.findOneAndUpdate(
        { _id: categoryId },
        {
          status,
        }
      );
      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Không thể cập nhật thông tin danh mục');
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
