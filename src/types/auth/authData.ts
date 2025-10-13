export interface loginData{
    email: string;
    password: string;
}
export interface roleData{
    data : string[];
}
export interface signData{
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
}
export interface verifyEmailData{
    email: string;
    verificationCode: string;
}
export interface resendData{
    email: string;
}