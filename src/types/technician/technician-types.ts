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