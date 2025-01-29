'use client'


import { UserContext } from '@/context/UserContext'
import { ReactElement, useContext } from 'react'
import GoogleButton from 'react-google-button'

const Page = (): ReactElement => {
    const { logOut, logIn, profile } = useContext(UserContext)

    const handleLoginClick = () => logIn()

    const handleLogoutClick = () => logOut()

    return (
        <div className="flex flex-col items-center content-center">
            <h2 className="mb-10">Website under construction</h2>

            <GoogleButton type="dark" onClick={handleLoginClick}>
                Sign in with Google 🚀{' '}
            </GoogleButton>
            {profile ? (
                <button onClick={handleLogoutClick}>Logout</button>
            ) : null}
        </div>
    )
}

export default Page
