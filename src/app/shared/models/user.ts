import { Role } from "./role";

export class User {
    id: number | undefined;
    email: string | undefined;
    displayName: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    nicename: string | undefined;
    role: Role
    token: string | undefined;

}