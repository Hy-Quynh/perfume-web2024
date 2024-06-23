import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_CART_INFO,
  USER_INFO_KEY,
} from '../constants';

export const addProductToCart = (cardData: any) => {
  const userData = parseJSON(localStorage.getItem(USER_INFO_KEY), {});

  const currCart = parseJSON(
    localStorage.getItem(USER_CART_INFO + `_${userData?._id || ""}`),
    []
  );

  if (currCart?.length) {
    const findPrd = currCart?.findIndex(
      (item: any) => item?.product_id === cardData?.product_id
    );
    if (findPrd >= 0) {
      currCart[findPrd].quantity =
        Number(currCart[findPrd].quantity) + Number(cardData?.quantity);

      localStorage.setItem(
        USER_CART_INFO + `_${userData?._id || ""}`,
        JSON.stringify(currCart)
      );
      return window.dispatchEvent(new Event("storage"));
    }
  }

  currCart?.push(cardData);
  localStorage.setItem(
    USER_CART_INFO + `_${userData?._id || ""}`,
    JSON.stringify(currCart)
  );

  window.dispatchEvent(new Event("storage"));
};

export const parseJSON = (inputString: any, fallback?: any) => {
  if (inputString) {
    try {
      return JSON.parse(inputString);
    } catch (e) {
      return fallback;
    }
  } else {
    return fallback;
  }
};

export const logOut = () => {
  localStorage.removeItem(USER_INFO_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
