export interface doctorProfileData{
    email: string,
    fullName: string,
    specializationName: string,
    experienceYears: number,
    universityName: string,
    hospitalname: string,
    graduationYear: number,
    numberOfpatients: number,
    birthDay: string,
    phone: string,
    description: string,
    image: string,
    cv: string;
}
        
// service data
export interface serviceDays{
    dayOfWeek:number,
}
export interface timeSlots{
  start:string,
  end:string
}
export interface getTimeSlots{
  id : number,
  start: string,
  end: string,
  isBooking:boolean
}
export interface getServiceDays{
  dayOfWeek : number,
  timeSlots : getTimeSlots[]
}
export interface doctorServiceData{
    id: number,
    serviceNameEnglish: string,
    serviceNameArabic: string,
    descriptionEnglish : string,
    descriptionArabic : string,
    price: number,
    serviceDays : getServiceDays[],
    timeSlots : getTimeSlots[]
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
  timeSlots: timeSlots[]
}