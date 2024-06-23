const Product = require('../models/product');

module.exports = {
  getAllProduct: async (limit, offset, search, brand, category, min, max, status) => {
    try {
      const newSearch = search && search !== 'undefined' ? search : '';

      const query = [
        {
          $match: {
            name: { $regex: new RegExp(newSearch.toLowerCase(), 'i') },
            isDelete: false,
          },
        },
      ];

      if (status !== 'undefined') {
        query.push({
          $match: {
            status: !!status
          },
        })
      }

      if (brand && brand !== 'undefined') {
        query.push({
          $match: {
            $expr: {
              $eq: [{ $toString: '$brandId' }, brand],
            },
          },
        });
      }

      if (category && category !== 'undefined') {
        query.push({
          $match: {
            $expr: {
              $eq: [{ $toString: '$categoryId' }, category],
            },
          },
        });
      }

      const minExist = min && min !== 'undefined' && Number(min) > 0;
      const maxExist = max && max !== 'undefined' && Number(max) > 0;
      const minPrice = Number(min);
      const maxPrice = Number(max);

      if (minExist && maxExist) {
        query.push({
          $match: {
            $and: [
              { price: { $gte: minPrice } },
              { price: { $lte: maxPrice } },
            ],
          },
        });
      } else if (minExist) {
        query.push({
          $match: {
            price: { $gte: minPrice },
          },
        });
      } else if (maxExist) {
        query.push({
          $match: {
            price: { $lte: maxPrice },
          },
        });
      }

      const cloneQuery = [...query];

      query.push(
        ...[
          {
            $lookup: {
              from: 'brands',
              localField: 'brandId',
              foreignField: '_id',
              as: 'brand',
            },
          },
          {
            $unwind: '$brand',
          },
          {
            $lookup: {
              from: 'categorys',
              localField: 'categoryId',
              foreignField: '_id',
              as: 'category',
            },
          },
          {
            $unwind: '$category',
          },
        ]
      );

      if (offset === 'undefined' && limit && limit !== 'undefined') {
        query.push(
          ...[
            {
              $skip: 0,
            },
            {
              $limit: limit,
            },
          ]
        );
      }

      if (offset && limit && offset !== 'undefined' && limit !== 'undefined') {
        query.push(
          ...[
            {
              $skip: Number(offset),
            },
            {
              $limit: Number(limit),
            },
          ]
        );
      }

      query.push({
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          brandId: 1,
          categoryId: 1,
          description: 1,
          price: 1,
          salePrice: 1,
          initQuantity: 1,
          currentQuantity: 1,
          status: 1,
          isDelete: 1,
          createdAt: 1,
          updatedAt: 1,
          brandName: '$brand.name',
          categoryName: '$category.name',
        },
      });

      const getProduct = await Product.aggregate(query);

      if (getProduct) {
        const totalProduct = await Product.aggregate(cloneQuery);
        return {
          success: true,
          payload: {
            product: getProduct,
            total: totalProduct?.length,
          },
        };
      } else {
        throw new Error('Lấy thông tin sản phẩm thất bại');
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

  getBestSellingProduct: async (limit) => {
    try {
      const query = [
        {
          $match: {
            status: true,
          },
        },
        {
          $addFields: {
            soldQuantity: { $subtract: ['$initQuantity', '$currentQuantity'] },
          },
        },
        {
          $sort: { soldQuantity: -1 },
        },
        {
          $limit: Number(limit),
        },
      ];

      query.push(
        ...[
          {
            $lookup: {
              from: 'brands',
              localField: 'brandId',
              foreignField: '_id',
              as: 'brand',
            },
          },
          {
            $unwind: '$brand',
          },
          {
            $lookup: {
              from: 'categorys',
              localField: 'categoryId',
              foreignField: '_id',
              as: 'category',
            },
          },
          {
            $unwind: '$category',
          },
          {
            $project: {
              _id: 1,
              name: 1,
              image: 1,
              brandId: 1,
              categoryId: 1,
              description: 1,
              price: 1,
              salePrice: 1,
              initQuantity: 1,
              currentQuantity: 1,
              status: 1,
              isDelete: 1,
              createdAt: 1,
              updatedAt: 1,
              brandName: '$brand.name',
              categoryName: '$category.name',
            },
          },
        ]
      );

      const getProduct = await Product.aggregate(query);

      if (getProduct) {
        return {
          success: true,
          payload: {
            product: getProduct,
          },
        };
      } else {
        throw new Error('Lấy thông tin sản phẩm thất bại');
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

  addNewProduct: async (
    name,
    image,
    brandId,
    categoryId,
    description,
    price,
    salePrice,
    initQuantity
  ) => {
    try {
      const addRes = await Product.insertMany([
        {
          name,
          image,
          brandId,
          categoryId,
          description,
          price,
          salePrice,
          initQuantity,
          currentQuantity: initQuantity,
        },
      ]);

      if (addRes) {
        const getProduct = await Product.find({ isDelete: false })
          .lean()
          .exec();

        return {
          success: true,
          payload: getProduct,
        };
      } else {
        throw new Error('Thêm sản phẩm thất bại');
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

  deleteProduct: async (productId) => {
    try {
      const deleteProduct = await Product.findOneAndUpdate(
        { _id: productId },
        { isDelete: true }
      );

      if (deleteProduct) {
        return {
          success: true,
        };
      } else {
        throw new Error('Xoá sản phẩm thất bại');
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

  updateProduct: async (
    productId,
    name,
    image,
    brandId,
    categoryId,
    description,
    price,
    salePrice,
    initQuantity
  ) => {
    try {
      const updateRes = await Product.findOneAndUpdate(
        { _id: productId },
        {
          name,
          image,
          brandId,
          categoryId,
          description,
          price,
          salePrice,
          initQuantity,
        }
      );

      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật sản phẩm thất bại');
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

  getProductById: async (productId) => {
    try {
      const query = [
        {
          $match: {
            $expr: {
              $eq: [{ $toString: '$_id' }, productId],
            },
          },
        },
        {
          $lookup: {
            from: 'brands',
            localField: 'brandId',
            foreignField: '_id',
            as: 'brand',
          },
        },
        {
          $unwind: '$brand',
        },
        {
          $lookup: {
            from: 'categorys',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: '$category',
        },
        {
          $project: {
            _id: 1,
            name: 1,
            image: 1,
            brandId: 1,
            categoryId: 1,
            description: 1,
            price: 1,
            salePrice: 1,
            initQuantity: 1,
            currentQuantity: 1,
            status: 1,
            isDelete: 1,
            createdAt: 1,
            updatedAt: 1,
            brandName: '$brand.name',
            categoryName: '$category.name',
          },
        },
      ];

      const getProduct = await Product.aggregate(query);

      if (getProduct?.length) {
        return {
          success: true,
          payload: getProduct[0],
        };
      } else {
        throw new Error('Lấy thông tin sản phẩm thất bại');
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

  updateProductStatus: async (productId, status) => {
    try {
      const updateRes = await Product.findOneAndUpdate(
        { _id: productId },
        { status }
      );

      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật sản phẩm thất bại');
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
