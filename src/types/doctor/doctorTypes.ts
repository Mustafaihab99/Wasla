export interface doctorProfileData{
    email: string,
    fullName: string,
    specializationName: string,
    experienceYears: number,
    universityName: string,
    graduationYear: number,
    birthDay: string,
    phone: string,
    description: string,
    image: string,
    cv: string;
}
// service data
export interface serviceDays{
    id:number,
    dayOfWeek:number,
}
export interface serviceDates{
    id:number,
    date:string,
}
export interface timeSlots{
    id:number,
    start:string,
    end:string
}
export interface doctorServiceData{
    id: number,
    serviceName: string,
    description : string,
    price: number,
    serviceDays : serviceDays[],
    serviceDates : serviceDates[],
    timeSlots : timeSlots[]
}
// add service
export interface doctorServiceAdd{
  doctorId: string,
  serviceName: {
    english: string,
    arabic: string
  },
  description: {
    english: string,
    arabic: string
  },
  price: number,
  serviceDays: serviceDays[],
  serviceDates: serviceDates[],
  timeSlots: timeSlots[]
}
// edit
export interface doctorServiceEdit{
  serviceId : number,
  serviceName: {
    english: string,
    arabic: string
  },
  description: {
    english: string,
    arabic: string
  },
  price: number,
  serviceDays: serviceDays[],
  serviceDates: serviceDates[],
  timeSlots: timeSlots[]
}