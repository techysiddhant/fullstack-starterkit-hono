import { UserProfile } from '@/components/user/user-profile'
import React from 'react'

const UserProfilePage = async ({ params }: { params: { username: string } }) => {
    const { username } = await params
    return (
        <div>
            <h2 className='text-2xl'>Profile page</h2>
            <UserProfile username={username} />
        </div>
    )
}

export default UserProfilePage