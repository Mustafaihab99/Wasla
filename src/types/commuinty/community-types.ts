
export interface mainPostData{
    userId: string,
    userName: string,
    profilePhoto: string,
    postId: number,
    content: string,
    files: string [],
    numberofReacts: number,
    numberofSaves: number,
    numberofComments : number,
    isLoved: boolean,
    isSaved: boolean,
    createdAt: string,
    updatedAt: string
}
export interface singlePostData{
    postId: number,
    content: string,
    files: string [],
    numberofReacts: number,
    numberofSaves: number,
    numberofComments: number,
    isLoved: boolean,
    isSaved: boolean,
    createdAt: string,
    updatedAt: string
}
export interface postData {
    pageNumber: number,
    pageSize: number,
    totalCount: number,
    data: singlePostData[]
}
export interface myPostsData {
    userId: string,
    userName: string,
    profilePhoto: string,
    posts: postData[]
}
export interface toggleReactionData{
    targetId: number,
    targetType: number,
    reactionType: number,
    userId: string
}
export interface PaginationResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  data: T[];
}
export interface UserPostsResponse {
  userId: string;
  userName: string;
  profilePhoto: string;
  posts: PaginationResponse<singlePostData>;
}
export interface postAllCommentData{
    pageNumber: number,
    pageSize: number,
    totalCount: number,
    data :singleCommentData[]
}
export interface singleCommentData{
    commentId: number,
    content: string,
    isLove: boolean,
    numberOfLikes: number,
    file: string | null,
    userName: string,
    userId : string,
    userProfile: string,
    createdAt: string,
    updatedAt: string
}
export interface makeReportData{
    userId: string,
    reason: string,
    targetId: number,
    targetType: number
}