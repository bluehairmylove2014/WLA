import { UserLocation } from './UserLocation'

export interface User {
    user_id: string,
    email: string,
    avatar: string,
    username: string,
    password: string,
    display_name: string,
    account_type: string,
    account_status: string,
    createat: string,
    location: UserLocation,
    bio: string,
    follower: string[],
    following: string[]
}