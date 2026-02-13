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