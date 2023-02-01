export type FriendRequest = {
    id: string;
    avatarUrl: string;
    name: string;
    createdAt: Date;
    status?: FriendRequestStatus;
};

export enum FriendRequestStatus {
    Pending = 1,
    Accepted = 2,
    Rejected = 3
}