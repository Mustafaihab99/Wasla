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
    rating: number
}        
// edit doctor profile
export interface editdoctorProfileData{
    userId : string,
    fullName: string,
    phone: string,
    birthDay: string,
    experienceYears: number,
    universityName: string,
    graduationYear: number,
    hospitalname: string,
    specializationId: string,
    profilePhoto: string,
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
// doctor charts data
export interface monthData{
  month : number,
  amount: number
}
export interface yearsData{
  year: number,
  months: monthData[]
}
export interface doctorChartsData{
  numOfPatients : number,
  numOfBookings : number,
  numOfCompletedBookings : number,
  totalAmount : number,
  years: yearsData[]
}
// booking list for doctor
export interface doctorBookingListData{
      bookingId: number,
      serviceName: string,
      userName: string,
      userImage: string,
      date: string,
      start: string,
      end: string,
      day: number,
      bookingType: number,
      phone: string,
      price: number,
      bookingImages: string[]
}
// update time for book
export interface doctorUpdateBookData{
  bookingId: number,
  newDayOfWeek: number,
  newStart: string,
  newEnd: string,
  bookingDate: string
}