export interface CreateOfferDto {

    offerType: string, // Vandor // Generic
    vandors: [any] // ["a2312413551"]
    title: string // INR 200 off on week days
    description: string // any description with terms and conditions
    minValue: number // minimum order amount should be 300
    offerAmount: number // 200
    startValididty: Date  // 
    endValididty: Date
    promocode: string // WEEK200
    promoType: string // USER // ALL // BANK // CARD
    bank: [any] //
    bins: [any] //
    pincode: string
    isActive: boolean

}