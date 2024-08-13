export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    roles: number[];
    isVerifiedAccount: boolean;
    createdAt: string;  
    user_id: string;
}
