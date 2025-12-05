export interface residentProfile{
    fullname: string,
    email: string,
    phoneNumber: string,
    imageUrl: string,
}
export interface doctorsToResidentData{
    id: string,
    fullName: string,
    specialtyName : string,
    experienceYears: number,
    rating: number,
    universityName: string,
    numberOfpatients: number,
    graduationYear: number,
    hospitalname: string,
    birthDay: string,
    phone: string,
    description: string,
    imageUrl: string,
    cvUrl: string
}

export interface myBookingDoctor{
    id: number,
    start: string,
    end: string,
    day: string,
    date: string,
    serviceProviderName: string,
    serviceProviderProfilePhoto: string,
    serviceName: string,
    status : number,
    price: number
}
// charts resident
export interface monthResData{
    month: number,
    bookings: number,
    amount: number
}
export interface yearsResData{
    year: number,
    months: monthResData[]
}
export interface residentChartsData{
    numOfBookings: number,
    totalAmount: number,
    years: yearsResData[]
}