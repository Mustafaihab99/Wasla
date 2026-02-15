export interface GymProfileData{
    id: string,
    email : string,
    businessName: string,
    ownerName: string,
    description: string,
    phones: string[],
    profilePhoto: string,
    photos: string[],
    reviewsCount: number,
    rating: number
}
export interface gymServiceData{
    id: number,
    serviceProviderId: string,
    name: {
        arabic:string,
        english:string
    },
    description: {
        arabic:string,
        english:string
    },
    price: number,
    durationInMonths: number,
    type: number,
    precentage : number,
    newPrice : number,
    photoUrl: string
}
export interface showAllGymData{
    id: string,
    name: string,
    description: string,
    rating: number,
    imageUrl: string
}
export interface GymResidentBookingData{
    bookingId: number,
    gymName: string,
    imageUrl: string,
    bookingTime: string,
    durationInMonths: 2,
    serviceName: {
        english: string,
        arabic: string
    },
    bookingStatus: number
}
export interface GymChartsData{
    numberOfBookings: number,
    numberOfTrainees: number,
    totalAmount: number,
    years: [
      {
        year: number,
        months: [
          {
            month: number,
            amount: number
          }
        ]
      }
    ]
}
export interface gymBookData{
    bookingId: number,
    name: string,
    imageUrl: string,
    bookingTime: string,
    durationInMonths:number,
    serviceName: {
        english: string,
        arabic: string
    },
    price: number,
    bookingStatus: number
}