export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    jwtToken?: string;
    refreshToken?: string;
    role: string;
}
