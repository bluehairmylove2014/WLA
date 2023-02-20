import { UserLocation } from './UserLocation'

export interface User {
    id: number | null,
    email: string | null,
    avt: string | null,
    usn: string | null,
    psw: string | null,
    name: string | null,
    type: string,
    status: string | null,
    createat: string | null,
    location: UserLocation | null,
    follower: number[] | null
}