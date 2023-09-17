import { AppRole } from "./app-role";

export interface UserData {
    userId: number;
    username: string;
    userRoles: AppRole[];
}