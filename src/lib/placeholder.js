// Neutral placeholder copy for CMS bodies and legal text. The source copy is intentionally NOT
// reproduced; only the recorded structure (block types, word counts, character counts, line
// breaks) is. Matching the character count as well as the word count keeps each paragraph's line
// count close to the source at every width (lorem words are longer on average than the source
// prose, so a word-count-only generator wrapped 0-1 lines late per paragraph).

const WORDS = (
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et ' +
  'dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea ' +
  'commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur ' +
  'excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum ' +
  'integer posuere erat a ante venenatis dapibus porta ac consectetur vestibulum morbi leo risus cras mattis ' +
  'purus sit amet fermentum aenean lacinia bibendum nulla sed consectetur donec ullamcorper nulla non metus ' +
  'auctor fringilla maecenas faucibus mollis interdum etiam porta sem malesuada magna vehicula'
).split(' ')

const N = WORDS.length
const WINDOW = 12 // candidates considered per word when steering toward a character target
// Lorem letters (lowercase, many i/l/t) set ~3% narrower in TWK Lausanne than the source prose
// (capitals, digits, punctuation), so character targets are scaled up to match rendered width.
const WIDTH_BIAS = 1.03
const target = (chars) => (chars == null ? null : Math.round(chars * WIDTH_BIAS))

/**
 * Pick `count` lorem words. Without `letters` the pick is a fixed deterministic walk; with it,
 * each word is the candidate (from a small deterministic window) whose length best keeps the
 * running total on course for `letters` letters in total.
 */
function pick(count, seed, letters, step = 3, mult = 7) {
  const out = []
  let left = letters
  for (let i = 0; i < count; i++) {
    const start = (seed * mult + i * step) % N
    if (letters == null) {
      out.push(WORDS[start])
      continue
    }
    const want = left / (count - i)
    let best = WORDS[start]
    for (let k = 0; k < WINDOW; k++) {
      const w = WORDS[(start + k * 5) % N]
      if (Math.abs(w.length - want) < Math.abs(best.length - want)) best = w
    }
    out.push(best)
    left -= best.length
  }
  return out
}

const cap = (w) => w[0].toUpperCase() + w.slice(1)

/**
 * Deterministic lorem prose with exactly `count` words, sentence-cased with a full stop every ~12
 * words. `chars` (optional) is the target length in characters including spaces and punctuation.
 */
export function words(count, seed = 0, rawChars) {
  if (!count) return ''
  const chars = target(rawChars)
  const breaks = []
  for (let i = 12; i < count - 2; i += 12) breaks.push(i)
  // spaces between words + one extra char per interior full stop + the final full stop
  const letters = chars == null ? null : Math.max(count, chars - (count - 1) - breaks.length - 1)
  const out = pick(count, seed, letters)
  let s = ''
  out.forEach((w, i) => {
    const startSentence = i === 0 || breaks.includes(i)
    if (startSentence && i > 0) s = s.replace(/ $/, '. ')
    s += (startSentence ? cap(w) : w) + ' '
  })
  return s.trim() + '.'
}

/** Unpunctuated lowercase run of `count` words (`chars` target optional), e.g. an inline bold term. */
export function phrase(count, seed = 0, rawChars) {
  if (!count) return ''
  const chars = target(rawChars)
  const letters = chars == null ? null : Math.max(count, chars - (count - 1))
  return pick(count, seed, letters).join(' ')
}

/** Title-cased placeholder heading of `count` words (`chars` target optional). */
export function heading(count, seed = 0, rawChars) {
  if (!count) return ''
  const chars = target(rawChars)
  const letters = chars == null ? null : Math.max(count, chars - (count - 1))
  return pick(count, seed * 5 + 1, letters, 4, 1).map(cap).join(' ')
}
