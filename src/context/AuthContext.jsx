import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { CLIENT_ID } from '../lib/google'

const AuthContext = createContext(null)
const STORAGE_KEY_TOKEN = 'flashcard_access_token'
const STORAGE_KEY_USER = 'flashcard_user'

async function validateAndGetUser(token) {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  const info = await res.json()
  return {
    name: info.name,
    displayName: info.name,
    email: info.email,
    photoURL: info.picture,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = loading
  const [accessToken, setAccessToken] = useState(null)
  const [error, setError] = useState(null)

  // On mount: check for a stored token and validate it
  useEffect(() => {
    if (!CLIENT_ID) {
      setUser(null)
      return
    }

    async function restoreSession() {
      const storedToken = sessionStorage.getItem(STORAGE_KEY_TOKEN)
      if (storedToken) {
        const userInfo = await validateAndGetUser(storedToken)
        if (userInfo) {
          setAccessToken(storedToken)
          setUser(userInfo)
          return
        }
        // Token expired — clear storage
        sessionStorage.removeItem(STORAGE_KEY_TOKEN)
        sessionStorage.removeItem(STORAGE_KEY_USER)
      }
      setUser(null)
    }

    function checkReady() {
      if (window.google?.accounts?.oauth2) {
        restoreSession()
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
          const token = tokenResponse.access_token
          setAccessToken(token)
          sessionStorage.setItem(STORAGE_KEY_TOKEN, token)

          try {
            const userInfo = await validateAndGetUser(token)
            if (userInfo) {
              setUser(userInfo)
              sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userInfo))
            } else {
              setUser({ name: 'User', displayName: 'User', email: '', photoURL: '' })
            }
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
    sessionStorage.removeItem(STORAGE_KEY_TOKEN)
    sessionStorage.removeItem(STORAGE_KEY_USER)
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
