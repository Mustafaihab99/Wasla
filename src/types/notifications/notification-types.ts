export interface notificationData { 
    id: number,
    userId: string,
    type: number,
    referenceId: string,
    title: string,
    body: string,
    isSeen: boolean,
    createdAt: string,
    lastSeenAt: string | null,
    imageUrl: string
}