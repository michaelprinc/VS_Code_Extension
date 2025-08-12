// Fast heuristic. Roughly ~4 chars/token for English technical text.
// Show both estimates: chars and ~tokens.
export function estimateTokens(text: string) {
  const chars = text.length;
  const approxTokens = Math.ceil(chars / 4); // heuristic
  return { chars, approxTokens };
}
