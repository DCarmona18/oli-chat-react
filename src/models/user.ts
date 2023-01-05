import { AUTH_TYPES } from "./constants";

export type User = {
    id: string;
    email: string;
    fullName: string;
    avatarUrl: string;
    authType: AUTH_TYPES;
    enabled: boolean;
    creationDate: number;
    accessToken: string;
};
