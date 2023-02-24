import { UserLocation } from './UserLocation'

export interface User {
    user_id: string,
    email: string | null,
    avatar: string | null,
    username: string | null,
    password: string | null,
    display_name: string | null,
    account_type: string | null,
    account_status: string | null,
    createat: string | null,
    location: UserLocation,
    follower: string[],
    following: string[]
}