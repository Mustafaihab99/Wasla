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