const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SCOPES = 'https://www.googleapis.com/auth/drive.file'

let tokenClient = null

export function getTokenClient(callback) {
  if (tokenClient) return tokenClient

  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google Identity Services not loaded')
  }

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback,
  })

  return tokenClient
}

export function revokeToken(accessToken) {
  if (accessToken) {
    window.google.accounts.oauth2.revoke(accessToken)
  }
}

export { CLIENT_ID }
