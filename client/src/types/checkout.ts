export type CheckoutBody = {
  totalQuantity: number
  totalPrice: number
  paymentMethod: 'CARD' | 'CODE'
  cartData: {
    productId: string
    productName: string
    price: number
    salePrice: number
    orderPrice: number
    quantity: number
  }[],
  userInfo: {
    userId: string
    userName: string
    userEmail: string
    userAddress: string
  }
}

export type OrderStatusType = 'PAID' | 'ORDERED' | 'DELIVERY' | 'SHIPPED' | 'CANCEL'