export interface techProfileData{
    email: string,
    fullName: string,
    phone: string,
    birthDay: string,
    experienceYears: number,
    description: string,
    specialty: number,
    profilePhotoUrl: string,
    documentsUrls: string[],
    rate: number,
}
export interface showAllTechnicians{
    id: string,
    name: string,
    description: string,
    imageUrl: string,
    phoneNumber: string,
    rating: number,
    specialization: string,
    yearsOfExperience: number
}
export interface BookData{
    residentId: string,
    technicianId: string,
    price: number
    bookingDate: string
}
export interface TechnicianBookingData{
    bookingId: number,
    technicianName: string,
    technicianPhone: string,
    technicianImage: string,
    price: number,
    bookingDate: string,
    status: number
}
export interface TechnicianComingBookingData{
    bookingId: number,
    residentName: string,
    residentPhone: string,
    residentImage: string,
    price: number,
    bookingDate: string,
    status: number
}