export interface createEventData{
    userId: string,
    serviceProviderId: string,
    eventType: number
}

export interface userActivityData{
    id: string,
    name: string,
    description: string,
    image: string,
    rating: number,
    roleName : string
}

export interface conversionData{
    roleName: string,
    views: number,
    bookings: number,
    conversionRate: number
}
export interface userEventDashboardData{
    serviceProvidersBooking: userActivityData[],
    serviceProvidersView: userActivityData[],
    serviceProvidersFav: userActivityData[],
    conversion: conversionData[]
}