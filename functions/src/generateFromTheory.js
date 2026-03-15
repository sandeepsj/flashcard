const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })

/**
 * Generates 3–6 flashcards from a theory paragraph using Claude.
 */
async function generateFromTheory(text) {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `You are a DSA study assistant. Read the following theory paragraph and generate 3–6 high-quality flashcard Q&A pairs.

Focus on:
- Key concepts and definitions
- Time/space complexity claims
- Important distinctions or edge cases

Return ONLY valid JSON: [{"question": "...", "answer": "..."}, ...]
Keep each question and answer concise (1–3 sentences each).

Paragraph:
${text}`,
      },
    ],
  })

  const content = message.content[0].text.trim()
  const jsonMatch = content.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('No JSON array in response')

  const cards = JSON.parse(jsonMatch[0])
  if (!Array.isArray(cards)) throw new Error('Response is not an array')

  return cards.filter((c) => c.question && c.answer).slice(0, 6)
}

module.exports = { generateFromTheory }
