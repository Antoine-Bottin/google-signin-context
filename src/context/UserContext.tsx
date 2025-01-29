'use client'

import {
    createContext,
    PropsWithChildren,
    ReactElement,
    useCallback,
    useEffect,
    useState,
} from 'react'
import { useCookies } from 'react-cookie'

import {
    googleLogout,
    TokenResponse,
    useGoogleLogin,
} from '@react-oauth/google'
import axios from 'axios'

export const UserContext = createContext<{
    logOut: VoidFunction
    logIn: VoidFunction
    profile?: TUserProfile
    setAuthenticationCookies: (authToken: string) => void
}>({
    logOut: () => undefined,
    logIn: () => undefined,
    setAuthenticationCookies: () => undefined,
    profile: undefined,
})

type TUserProfile = {
    email: string
    family_name: string
    given_name: string
    id: string
    name: string
    picture: string
    verified_email: true
}

const UserContextProvider = ({ children }: PropsWithChildren): ReactElement => {
    const [user, setUser] =
        useState<
            Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>
        >()

    const [profile, setProfile] = useState<TUserProfile>()

    console.log(profile)

    const [cookies, setCookie] = useCookies(['token-cookie'])

    console.log('Cookies', cookies)

    const setAuthenticationCookies = useCallback(
        (authToken: string) => {
            setCookie('token-cookie', authToken, { path: '/' })
        },
        [setCookie]
    )

    const logIn = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error),
    })

    const logOut = () => {
        googleLogout()
        setProfile(undefined)
    }

    const userContext = {
        logOut,
        setAuthenticationCookies,
        logIn,
        profile,
    }

    /** Effects */

    useEffect(() => {
        if (user) {
            axios
                .get(
                    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json',
                        },
                    }
                )
                .then((res) => {
                    setProfile(res.data)
                })
                .catch((err) => console.log(err))
        }
    }, [user])

    return (
        <UserContext.Provider value={userContext}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider
