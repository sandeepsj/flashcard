const functions = require('firebase-functions')
const { generateFromQA } = require('./src/generateFromQA')
const { generateFromTheory } = require('./src/generateFromTheory')
const { fetchLeetCode } = require('./src/fetchLeetCode')

// CORS helper
function withCors(req, res, handler) {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }
  return handler(req, res)
}

exports.generateFromQA = functions
  .runWith({ timeoutSeconds: 60, memory: '256MB' })
  .https.onRequest(async (req, res) => {
    withCors(req, res, async () => {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
      const { text } = req.body
      if (!text?.trim()) return res.status(400).json({ error: 'text is required' })
      try {
        const cards = await generateFromQA(text)
        res.json({ cards })
      } catch (err) {
        functions.logger.error('generateFromQA error', err)
        res.status(500).json({ error: err.message })
      }
    })
  })

exports.generateFromTheory = functions
  .runWith({ timeoutSeconds: 60, memory: '256MB' })
  .https.onRequest(async (req, res) => {
    withCors(req, res, async () => {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
      const { text } = req.body
      if (!text?.trim()) return res.status(400).json({ error: 'text is required' })
      try {
        const cards = await generateFromTheory(text)
        res.json({ cards })
      } catch (err) {
        functions.logger.error('generateFromTheory error', err)
        res.status(500).json({ error: err.message })
      }
    })
  })

exports.fetchLeetCode = functions
  .runWith({ timeoutSeconds: 60, memory: '256MB' })
  .https.onRequest(async (req, res) => {
    withCors(req, res, async () => {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
      const { url } = req.body
      if (!url?.trim()) return res.status(400).json({ error: 'url is required' })
      try {
        const cards = await fetchLeetCode(url)
        res.json({ cards })
      } catch (err) {
        functions.logger.error('fetchLeetCode error', err)
        res.status(500).json({ error: err.message })
      }
    })
  })
