const API = 'https://www.googleapis.com/drive/v3'
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3'

function headers(accessToken) {
  return { Authorization: `Bearer ${accessToken}` }
}

export async function findOrCreateFolder(accessToken, name) {
  // Search for existing folder
  const q = `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`
  const res = await fetch(`${API}/files?q=${encodeURIComponent(q)}&fields=files(id,name)`, {
    headers: headers(accessToken),
  })
  const data = await res.json()
  if (data.files?.length) return data.files[0].id

  // Create folder
  const createRes = await fetch(`${API}/files`, {
    method: 'POST',
    headers: { ...headers(accessToken), 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, mimeType: 'application/vnd.google-apps.folder' }),
  })
  const folder = await createRes.json()
  return folder.id
}

export async function findFile(accessToken, folderId, filename) {
  const q = `name='${filename}' and '${folderId}' in parents and trashed=false`
  const res = await fetch(`${API}/files?q=${encodeURIComponent(q)}&fields=files(id,name)`, {
    headers: headers(accessToken),
  })
  const data = await res.json()
  return data.files?.[0]?.id || null
}

export async function readJsonFile(accessToken, fileId) {
  const res = await fetch(`${API}/files/${fileId}?alt=media`, {
    headers: headers(accessToken),
  })
  if (!res.ok) return null
  return res.json()
}

export async function writeJsonFile(accessToken, folderId, filename, data, existingFileId = null) {
  const metadata = { name: filename, mimeType: 'application/json' }
  const body = JSON.stringify(data)

  if (existingFileId) {
    // Update existing file
    const res = await fetch(`${UPLOAD_API}/files/${existingFileId}?uploadType=media`, {
      method: 'PATCH',
      headers: { ...headers(accessToken), 'Content-Type': 'application/json' },
      body,
    })
    return res.json()
  }

  // Create new file (multipart upload)
  const boundary = 'flashcard_boundary'
  const multipart =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
    JSON.stringify({ ...metadata, parents: [folderId] }) +
    `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n` +
    body +
    `\r\n--${boundary}--`

  const res = await fetch(`${UPLOAD_API}/files?uploadType=multipart`, {
    method: 'POST',
    headers: {
      ...headers(accessToken),
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipart,
  })
  return res.json()
}
