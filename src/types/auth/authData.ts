export interface loginData{
    email: string;
    password: string;
}
export interface roleData{
    id : string;
    roleName: string;
    value: string;
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
export interface forgetData{
    email: string;
    newPassword: string;
}