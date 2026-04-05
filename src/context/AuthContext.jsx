import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { CLIENT_ID } from '../lib/google'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = loading
  const [accessToken, setAccessToken] = useState(null)
  const [error, setError] = useState(null)

  // Wait for GIS script to load, then resolve loading state
  useEffect(() => {
    if (!CLIENT_ID) {
      setUser(null)
      return
    }

    function checkReady() {
      if (window.google?.accounts?.oauth2) {
        setUser(null) // no persisted session — user must click sign in
      } else {
        setTimeout(checkReady, 100)
      }
    }
    checkReady()
  }, [])

  const signInWithGoogle = useCallback(() => {
    setError(null)
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setError(tokenResponse.error)
            return
          }
          setAccessToken(tokenResponse.access_token)

          // Fetch user info
          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            })
            const info = await res.json()
            setUser({
              name: info.name,
              displayName: info.name,
              email: info.email,
              photoURL: info.picture,
            })
          } catch {
            setUser({ name: 'User', displayName: 'User', email: '', photoURL: '' })
          }
        },
      })
      client.requestAccessToken()
    } catch (err) {
      setError(err.message)
    }
  }, [])

  function signOut() {
    if (accessToken) {
      window.google.accounts.oauth2.revoke(accessToken)
    }
    setAccessToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, signInWithGoogle, signOut, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
