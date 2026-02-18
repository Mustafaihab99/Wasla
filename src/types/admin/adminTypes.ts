export interface ReportsData{
    id : number,
    fullName : string,
    email: string,
    message : string
}
export interface adminUsersData{
    id: string,
    name: string,
    email: string,
    status: number,
    createdAt:string
}
export interface AdminUsersResponse {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  data: adminUsersData[];
}

export interface AdminOverviewData{
    completedBookingsCount: number,
    canceledBookingsCount: number,
    countOfUsers: number,
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

export interface UserBase {
  phone: string;
  birthDay: string;
  profilePhoto: string;
}
export interface ResidentDetails {
  nationalId: string;
}
export interface DoctorDetails {
  experienceYears: number;
  universityName: string;
  graduationYear: number;
  hospitalName: string;
  description: string;
  cv: string;
}
export interface GymDetails{
      businessName: string,
      email: string,
      description: string,
      phones: string[],
      images: string[]
}
export type UserDetailsData =
  | {
      role: "resident";
      userBase: UserBase;
      details: ResidentDetails;
    }
  | {
      role: "doctor";
      userBase: UserBase;
      details: DoctorDetails;
    }
  | {
      role: "Gym";
      userBase: UserBase;
      details: GymDetails;
    }  
    ;
export interface GetUserDetailsResponse {
  success: boolean;
  message: string;
  data: UserDetailsData;
}
