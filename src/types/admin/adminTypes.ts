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