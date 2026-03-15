const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })

/**
 * Parses Q&A text into structured flashcards using Claude.
 * Input: raw text with Q: / A: pairs (or similar formats)
 * Output: array of { question, answer }
 */
async function generateFromQA(text) {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `You are a flashcard generator. Extract Q&A pairs from the following text and return them as a JSON array.

Each card should have:
- "question": the question text (concise)
- "answer": the answer text (concise but complete)

Return ONLY valid JSON: [{"question": "...", "answer": "..."}, ...]

Text:
${text}`,
      },
    ],
  })

  const content = message.content[0].text.trim()
  // Extract JSON from potential markdown code blocks
  const jsonMatch = content.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('No JSON array in response')

  const cards = JSON.parse(jsonMatch[0])
  if (!Array.isArray(cards)) throw new Error('Response is not an array')

  return cards.filter((c) => c.question && c.answer)
}

module.exports = { generateFromQA }
