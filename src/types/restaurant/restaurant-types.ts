export interface showAllRestaurants{
     id: string,
    name: string,
    description: string,
    phoneNumber: string,
    ownerName: string,
    restaurantCategoryId: number,
    profile: string,
    gallery: string[]
}
export interface restaurantDetailsData{
    email: string,
    restaurantCategoryName: string,
    id: string,
    name: string,
    description: string,
    phoneNumber: string,
    ownerName: string,
    restaurantCategoryId: number,
    profile: string,
    gallery: string[]
}
export interface addTableData {
    userId: string,
    restaurantId: string,
    numberOfPersons: number,
    reservationDate: string,
    reservationTime: string
}

export interface reversationData{
    id: number,
    restaurantId: string,
    numberOfPersons: number,
    restaurantName: string,
    restaurantProfile: string,
    restaurantPhone: string,
    reservationDate: string,
    reservationTime: string,
    status: number
}
export interface reversationDashboardData{
    id: number,
    userId: string,
    profile: string,
    name:string,
    phone: string, //photo
    numberOfPersons: number,
    reservationDate: string,
    reservationTime: string,
    status: number
}
export interface addCategoryMenuData {
    name: {
    english: string,
    arabic: string
  },
  restaurantId: string
}
export interface editCategoryMenuData {
    id: number
    name: {
    english: string,
    arabic: string
  },
}
export interface categoryMenuData {
    id: number,
    name: {
        english: string,
        arabic: string
    },
    nameValue: string,
    restaurantId: string
}
export interface itemMenuData{
    id: number,
    name: {
        english: string,
        arabic: string
    },
    nameValue: string,
    categoryName: string,
    price: number,
    discountPrice: number,
    imageUrl: string,
    preparationTime: number, 
    isAvailable: boolean,
    restaurantId: string,
    categoryId: number
}