import { UserLocation } from './UserLocation'

export interface User {
    id: string,
    email: string,
    avt: string,
    usn: string,
    psw: string,
    name: string,
    type: string,
    status: string,
    createat: string,
    location: UserLocation,
    follower: number[]
}