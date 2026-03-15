const Anthropic = require('@anthropic-ai/sdk')
const axios = require('axios')

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })

/**
 * Fetches a LeetCode problem and generates flashcards.
 * Uses LeetCode's GraphQL API to get problem details.
 */
async function fetchLeetCode(url) {
  // Extract problem slug from URL
  const match = url.match(/leetcode\.com\/problems\/([^/]+)/)
  if (!match) throw new Error('Invalid LeetCode URL')
  const slug = match[1]

  // Query LeetCode GraphQL API
  let problemText = ''
  try {
    const res = await axios.post(
      'https://leetcode.com/graphql',
      {
        query: `
          query getQuestion($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              title
              difficulty
              content
              exampleTestcases
              hints
            }
          }
        `,
        variables: { titleSlug: slug },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
          'User-Agent': 'Mozilla/5.0',
        },
        timeout: 10000,
      }
    )

    const q = res.data?.data?.question
    if (q) {
      // Strip HTML tags
      const stripHtml = (html) => html?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || ''
      problemText = `Title: ${q.title}\nDifficulty: ${q.difficulty}\n\nProblem:\n${stripHtml(q.content)}`
      if (q.hints?.length) problemText += `\n\nHints:\n${q.hints.join('\n')}`
    }
  } catch (err) {
    throw new Error(`Could not fetch LeetCode problem: ${err.message}. Try pasting the content in the Q&A tab.`)
  }

  if (!problemText) throw new Error('Empty problem content')

  // Generate cards via Claude
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `You are a DSA study assistant. Generate 3–5 flashcard Q&A pairs for this LeetCode problem.

Cover:
1. Problem statement (what to find/do)
2. Optimal approach / algorithm
3. Time and space complexity
4. Key insight or trick
5. Common edge cases (if relevant)

Return ONLY valid JSON: [{"question": "...", "answer": "..."}, ...]

Problem:
${problemText}`,
      },
    ],
  })

  const content = message.content[0].text.trim()
  const jsonMatch = content.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('No cards generated')

  const cards = JSON.parse(jsonMatch[0])
  return cards.filter((c) => c.question && c.answer)
}

module.exports = { fetchLeetCode }
