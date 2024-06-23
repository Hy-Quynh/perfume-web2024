import React from "react";
import { addProductToCart, parseJSON } from "../../utils/handleData";
import { FORMAT_NUMBER, USER_INFO_KEY } from "../../constants";
import { message } from "antd";

type ProductItemProps = {
  productId: any,
  productImage: any,
  productName: any,
  salePrice: any,
  productPrice: any,
  productQuantity: any,
  customClassName?: any,
}

export default function ProductItem({
  productId,
  productImage,
  productName,
  salePrice,
  productPrice,
  productQuantity,
  customClassName,
}: ProductItemProps) {
  const userData = parseJSON(localStorage.getItem(USER_INFO_KEY));

  return (
    <div className={customClassName || "col-lg-3 col-md-4 col-sm-6 pb-1"}>
      <div className="product-item bg-light mb-4 h-full">
        <div className="product-img position-relative overflow-hidden h-[70%]">
          <img className="img-fluid w-100 h-[100%] min-w-[345px] min-h-[327px]" src={productImage} alt="" />
          <div className="product-action">
            <div
              className="btn btn-outline-dark btn-square"
              onClick={async () => {
                if (!userData?._id) {
                  return message.error(
                    "Bạn cần đăng nhập để thực hiện chức năng này"
                  );
                }

                if (Number(productQuantity) < 1) {
                  return message.error(
                    "Số lượng lớn hơn số lượng sản phẩm hiện có"
                  );
                }

                addProductToCart({
                  product_id: productId,
                  product_name: productName,
                  product_price: productPrice,
                  product_sale: salePrice,
                  product_image: productImage,
                  quantity: 1,
                });

                message.success("Thêm sản phẩm vào giỏ hàng thành công");
              }}
            >
              <i className="fa fa-shopping-cart" />
            </div>
          </div>
        </div>
        <div className="text-center py-4">
          <a
            className="h6 text-decoration-none text-truncate whitespace-break-spaces px-[10px]"
            href={`/product/${productId}`}
          >
            {productName}
          </a>
          <div className="d-flex align-items-center justify-content-center mt-2">
            <h5>
              {salePrice > 0 && salePrice !== productPrice ? (
                <h6 style={{ textAlign: "center", color: "red" }}>
                  {FORMAT_NUMBER.format(salePrice)} đ
                </h6>
              ) : (
                <h6 style={{ textAlign: "center", color: "red" }}>
                  {FORMAT_NUMBER.format(productPrice)} đ
                </h6>
              )}
            </h5>
            {salePrice > 0 && salePrice !== productPrice ? (
              <h6 className="text-muted ml-2">
                <del>{FORMAT_NUMBER.format(productPrice)} đ</del>
              </h6>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
