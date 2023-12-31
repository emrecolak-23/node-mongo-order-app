
export class CartItemDto {
    _id: string
    unit: number
}

export class OrderDto {
   txnId: string
   amount: string
   items: [CartItemDto]
}